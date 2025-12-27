#!/usr/bin/env python3
"""
Wooftrace NFC Batch Programming Tool
Reads unprogrammed tags from the API and writes NFC URLs to physical tags
"""

import requests
import json
import sys
import time
import os
from getpass import getpass
from pathlib import Path

try:
    from smartcard.System import readers
    from smartcard.util import toHexString
    SMARTCARD_AVAILABLE = True
except ImportError:
    SMARTCARD_AVAILABLE = False
    print("⚠️  Warning: pyscard not installed. Install it with: pip3 install pyscard")

# NDEF URL Record helpers
def create_ndef_url_record(url):
    """Create an NDEF URL record for NFC tag"""
    # URL protocol prefixes
    protocols = {
        'http://www.': 0x01,
        'https://www.': 0x02,
        'http://': 0x03,
        'https://': 0x04,
    }

    # Find matching protocol
    prefix_byte = 0x00
    url_suffix = url
    for prefix, code in protocols.items():
        if url.startswith(prefix):
            prefix_byte = code
            url_suffix = url[len(prefix):]
            break

    # Build NDEF URL record
    url_bytes = url_suffix.encode('utf-8')
    payload = bytes([prefix_byte]) + url_bytes

    # NDEF record header
    # TNF = 0x01 (Well-known), MB=1, ME=1, SR=1
    header = 0xD1  # 11010001
    type_length = 0x01
    payload_length = len(payload)
    record_type = 0x55  # 'U' for URL

    ndef_record = bytes([
        header,
        type_length,
        payload_length,
        record_type
    ]) + payload

    # NDEF message (TLV format)
    # T=0x03 (NDEF Message), L=length, V=value
    ndef_message = bytes([0x03, len(ndef_record)]) + ndef_record + bytes([0xFE])

    return ndef_message


class WooftraceNFCProgrammer:
    def __init__(self, api_url="http://localhost:3000", frontend_url="http://localhost:5173"):
        self.api_url = api_url
        self.frontend_url = frontend_url
        self.admin_token = None
        self.tags = []

    def login(self):
        """Login as admin"""
        print("\n🔐 Admin Login")
        email = input("Email: ")
        password = getpass("Password: ")

        try:
            response = requests.post(
                f"{self.api_url}/api/admin/auth/login",
                json={"email": email, "password": password}
            )
            response.raise_for_status()
            data = response.json()
            self.admin_token = data['token']
            print("✓ Login successful!\n")
            return True
        except Exception as e:
            print(f"✗ Login failed: {e}\n")
            return False

    def load_tags(self, batch_number=None):
        """Load unprogrammed tags from API"""
        if not self.admin_token:
            print("Please login first")
            return False

        try:
            params = {"activated": "false", "limit": 100}
            if batch_number:
                params["batch"] = batch_number

            response = requests.get(
                f"{self.api_url}/api/admin/factory/tags",
                headers={"Authorization": f"Bearer {self.admin_token}"},
                params=params
            )
            response.raise_for_status()
            data = response.json()

            self.tags = data['tags']
            print(f"✓ Loaded {len(self.tags)} unprogrammed tags\n")
            return True
        except Exception as e:
            print(f"✗ Error loading tags: {e}\n")
            return False

    def write_nfc_tag(self, nfc_id, url):
        """Write URL to NFC tag using smartcard reader"""
        if not SMARTCARD_AVAILABLE:
            print("  [SIMULATED] Would write to NFC tag")
            print(f"  NFC ID: {nfc_id}")
            print(f"  URL: {url}")
            time.sleep(1)
            return True

        try:
            # Get available readers
            r = readers()
            if len(r) == 0:
                print("  ✗ No card readers found")
                return False

            reader = r[0]
            print(f"  Using reader: {reader}")

            # Connect to card
            connection = reader.createConnection()
            connection.connect()

            # Create NDEF message
            ndef_message = create_ndef_url_record(url)

            # Write to tag (NTAG213/215/216 compatible)
            # This is a simplified version - you may need to adjust based on your tag type

            # NTAG write command: FF D6 00 [page] [length] [data]
            # Start writing from page 4 (after UID and lock bytes)
            page = 4
            for i in range(0, len(ndef_message), 4):
                chunk = ndef_message[i:i+4]
                # Pad if needed
                if len(chunk) < 4:
                    chunk += bytes([0] * (4 - len(chunk)))

                # Write 4 bytes to page
                apdu = [0xFF, 0xD6, 0x00, page, 0x04] + list(chunk)
                response, sw1, sw2 = connection.transmit(apdu)

                if sw1 != 0x90:
                    print(f"  ✗ Write failed at page {page}: {sw1:02X} {sw2:02X}")
                    return False

                page += 1

            print(f"  ✓ Successfully wrote {len(ndef_message)} bytes to tag")
            return True

        except Exception as e:
            print(f"  ✗ Error writing to NFC tag: {e}")
            return False

    def start_batch_programming(self):
        """Start the batch programming process"""
        if not self.tags:
            print("No tags loaded. Please load tags first.")
            return

        print(f"\n{'='*60}")
        print(f"Starting batch programming of {len(self.tags)} tags")
        print(f"{'='*60}\n")

        success_count = 0
        error_count = 0

        for idx, tag in enumerate(self.tags, 1):
            nfc_id = tag['nfcId']
            url = f"{self.frontend_url}/pet/nfc/{nfc_id}"

            print(f"[{idx}/{len(self.tags)}] Programming tag: {nfc_id}")
            print(f"  URL: {url}")

            input("  Press ENTER when tag is placed on reader...")

            if self.write_nfc_tag(nfc_id, url):
                success_count += 1
                print(f"  ✓ Tag programmed successfully!\n")
            else:
                error_count += 1
                retry = input("  Retry this tag? (y/n): ")
                if retry.lower() == 'y':
                    if self.write_nfc_tag(nfc_id, url):
                        success_count += 1
                        error_count -= 1
                        print(f"  ✓ Tag programmed successfully!\n")
                    else:
                        print(f"  ✗ Retry failed. Skipping...\n")
                else:
                    print(f"  Skipping tag...\n")

        print(f"\n{'='*60}")
        print(f"Batch Programming Complete!")
        print(f"{'='*60}")
        print(f"Total: {len(self.tags)}")
        print(f"Success: {success_count}")
        print(f"Failed: {error_count}")
        print(f"{'='*60}\n")


def load_env_config():
    """Load configuration from .env file if it exists"""
    env_file = Path(__file__).parent / '.env'
    config = {}
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    config[key.strip()] = value.strip()
    return config


def main():
    print("="*60)
    print("🐾 Wooftrace NFC Batch Programming Tool")
    print("="*60)

    # Load environment config
    env_config = load_env_config()

    # Configuration with environment variable defaults
    default_api = env_config.get('API_URL', 'http://localhost:3000')
    default_frontend = env_config.get('FRONTEND_URL', 'http://localhost:5173')

    print(f"\nEnvironment: {'Production (wooftrace.com)' if 'wooftrace.com' in default_frontend else 'Development (localhost)'}")

    api_url = input(f"API URL [{default_api}]: ").strip() or default_api
    frontend_url = input(f"Frontend URL [{default_frontend}]: ").strip() or default_frontend

    programmer = WooftraceNFCProgrammer(api_url, frontend_url)

    # Login
    if not programmer.login():
        sys.exit(1)

    # Load tags
    batch_number = input("Batch number (optional, press ENTER to skip): ").strip() or None
    if not programmer.load_tags(batch_number):
        sys.exit(1)

    # Show tags
    print("Tags to program:")
    for idx, tag in enumerate(programmer.tags[:10], 1):
        print(f"  {idx}. {tag['nfcId']} (Activation: {tag['activationCode']})")
    if len(programmer.tags) > 10:
        print(f"  ... and {len(programmer.tags) - 10} more")

    # Confirm
    confirm = input(f"\nProgram {len(programmer.tags)} tags? (y/n): ")
    if confirm.lower() != 'y':
        print("Cancelled.")
        sys.exit(0)

    # Start programming
    programmer.start_batch_programming()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nCancelled by user.")
        sys.exit(0)
