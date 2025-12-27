# Wooftrace NFC Batch Programming Tool

This tool allows you to batch program NFC tags with Wooftrace URLs using your wCopy Smart Reader.

## Prerequisites

### Install Python dependencies:
```bash
pip3 install pyscard requests
```

If you get an error installing pyscard, you may need:
```bash
brew install pcsc-lite
```

## Usage

### Method 1: Python Script (Recommended for macOS)

1. Make sure your backend server is running:
```bash
cd /Users/ratemyplate/Documents/Claude\ Coding/Playground/Woofly/backend
npm run dev
```

2. Run the batch programming tool:
```bash
cd /Users/ratemyplate/Documents/Claude\ Coding/Playground/Woofly/nfc-programming-tool
python3 nfc_batch_programmer.py
```

3. Follow the prompts:
   - Enter API URL (default: http://localhost:3000)
   - Enter Frontend URL (default: http://localhost:5173)
   - Login with admin credentials
   - Optionally filter by batch number
   - Confirm and start programming

4. For each tag:
   - Place the NFC tag on the reader
   - Press ENTER to program
   - Wait for confirmation
   - Remove tag and place next one

### Method 2: Web Interface

1. Open the HTML tool:
```bash
open /Users/ratemyplate/Documents/Claude\ Coding/Playground/Woofly/nfc-programming-tool/index.html
```

2. Configure the API and Frontend URLs

3. Click "Load Unprogrammed Tags"

4. Login with admin credentials when prompted

5. Click "Start Programming"

6. Follow on-screen instructions for each tag

**Note:** The web interface works best on Android Chrome for actual NFC writing. On desktop, it will simulate the process.

## How It Works

1. **Fetch Tags**: The tool fetches unprogrammed tags from your Wooftrace backend API using the Factory Panel endpoints

2. **Generate URLs**: For each tag, it creates a URL in the format:
   ```
   http://localhost:5173/pet/nfc/{nfcId}
   ```

3. **Write NFC**: The tool writes an NDEF URL record to the NFC tag using your wCopy Smart Reader

4. **Track Progress**: Shows success/failure status for each tag programmed

## Workflow

```
┌─────────────────┐
│  Generate Tags  │  (via Factory Panel)
│  in Database    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Load Tags     │  (Python script fetches via API)
│   from API      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Place Tag on   │
│  NFC Reader     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Write NDEF     │  (Script writes URL to tag)
│  URL to Tag     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Tag Ready!    │  (Tag can now be activated by users)
└─────────────────┘
```

## NFC Tag Specifications

- **Compatible Tags**: NTAG213, NTAG215, NTAG216, MIFARE Ultralight
- **Data Written**: NDEF URL record pointing to pet profile
- **Memory Used**: ~40-60 bytes (depending on URL length)
- **Read Method**: Any NFC-enabled smartphone

## Troubleshooting

### Reader Not Detected
```bash
# Check if reader is connected
system_profiler SPUSBDataType | grep -i "smart reader"
```

### pyscard Installation Issues
```bash
# On macOS, you may need:
xcode-select --install
brew install swig pcsc-lite
pip3 install pyscard
```

### Permission Denied
```bash
# Make sure script is executable
chmod +x nfc_batch_programmer.py
```

### API Connection Issues
- Verify backend is running on http://localhost:3000
- Check admin credentials are correct
- Ensure tags have been generated in Factory Panel first

## Advanced Options

### Filter by Batch
When prompted for batch number, enter the batch ID to only program tags from that specific batch.

### Retry Failed Tags
If a tag fails to program, you'll be prompted to retry before moving to the next tag.

### Export Programming Log
The script outputs a summary at the end showing:
- Total tags attempted
- Successfully programmed
- Failed (with reasons)

## Security Notes

- Admin credentials are required to fetch tag data
- Token is stored in memory only (not saved to disk)
- Use HTTPS URLs in production for secure tag URLs

## Production Deployment

For production use (wooftrace.com):

### Quick Setup

1. **Switch to production environment:**
   ```bash
   cd /Users/ratemyplate/Documents/Claude\ Coding/Playground/Woofly/nfc-programming-tool
   cp .env.production .env
   ```

2. **Run the tool:**
   ```bash
   python3 nfc_batch_programmer.py
   ```

   The tool will automatically detect production URLs and show:
   ```
   Environment: Production (wooftrace.com)
   ```

3. **Switch back to development:**
   ```bash
   cp .env.example .env
   # Edit .env to use localhost URLs
   ```

### Production Workflow

1. Generate tags with production batch numbers in Factory Panel

2. Use dedicated NFC programming station with wCopy Smart Reader

3. Run batch programming tool with production config

4. Keep logs of all programmed tags for quality control

5. Test a sample of programmed tags by scanning with smartphone

### Environment Files

- `.env` - Currently active configuration (git ignored)
- `.env.example` - Development template
- `.env.production` - Production template (wooftrace.com)
