#!/usr/bin/env python3
"""
Convert Adobe Illustrator (.ai) files to PNG format for web display.
AI files are PostScript/PDF-based, so we'll use available tools to render them.
"""

import os
import subprocess
import sys
from pathlib import Path

def convert_ai_to_png_with_ghostscript(ai_file, png_file, dpi=150):
    """Convert AI file to PNG using Ghostscript"""
    try:
        # AI files are PostScript/PDF format, gs can handle them
        cmd = [
            'gs',
            '-q',
            '-dNOPAUSE',
            '-dBATCH',
            '-dSAFER',
            '-sDEVICE=pngalpha',
            f'-r{dpi}',
            f'-sOutputFile={png_file}',
            ai_file
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if result.returncode != 0:
            return False, f"Ghostscript error: {result.stderr}"
        return True, "Success"
    except Exception as e:
        return False, str(e)

def convert_with_imagemagick(ai_file, png_file):
    """Convert using ImageMagick if available"""
    try:
        cmd = ['convert', '-density', '150', ai_file, png_file]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if result.returncode != 0:
            return False, f"ImageMagick error: {result.stderr}"
        return True, "Success"
    except Exception as e:
        return False, str(e)

def convert_with_libreoffice(ai_file, png_file, output_dir):
    """Convert using LibreOffice if available"""
    try:
        cmd = [
            'libreoffice',
            '--headless',
            '--convert-to', 'png',
            '--outdir', output_dir,
            ai_file
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        if result.returncode != 0:
            return False, f"LibreOffice error: {result.stderr}"
        return True, "Success"
    except Exception as e:
        return False, str(e)

def main():
    public_dir = Path('/workspaces/ramadanbot/public')
    ai_files = sorted(public_dir.glob('*___Hafs39__DM.ai'))
    
    if not ai_files:
        print("❌ No .ai files found in public directory")
        sys.exit(1)

    print(f"📄 Found {len(ai_files)} .ai files to convert")
    
    # Try different conversion methods
    methods = [
        ("Ghostscript", lambda ai, png: convert_ai_to_png_with_ghostscript(ai, png)),
        ("ImageMagick", lambda ai, png: convert_with_imagemagick(ai, png)),
    ]
    
    successful = 0
    failed = 0
    skipped = 0
    
    for ai_file in ai_files:
        png_file = ai_file.with_suffix('.png')
        png_filename = png_file.name
        
        # Skip if already converted
        if png_file.exists():
            # print(f"⏭️  Skipping {png_filename} (already exists)")
            skipped += 1
            continue
        
        success = False
        for method_name, converter in methods:
            success, msg = converter(str(ai_file), str(png_file))
            if success:
                print(f"✅ {png_filename} ({method_name})")
                successful += 1
                break
        
        if not success:
            print(f"❌ Failed: {png_filename}")
            failed += 1
    
    print(f"\n📊 Results: {successful} converted, {failed} failed, {skipped} skipped")
    
    if failed > 0:
        print("\n⚠️  Some files failed to convert. Installing Ghostscript via apt-get...")
        os.system('sudo apt-get install -y ghostscript imagemagick 2>/dev/null || echo "Install manually if needed"')

if __name__ == '__main__':
    main()
