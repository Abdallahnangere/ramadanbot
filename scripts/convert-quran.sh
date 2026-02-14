#!/bin/bash
# Quran Reader - AI to PNG Batch Conversion Script
# This script converts all 604 .ai files to PNG format for web display

set -e

PUBLIC_DIR="/workspaces/ramadanbot/public"
CONVERSION_METHOD="${1:-ghostscript}"

echo "🌙 Quran Reader - AI to PNG Conversion"
echo "======================================"
echo ""
echo "Method: $CONVERSION_METHOD"
echo "Public Directory: $PUBLIC_DIR"
echo ""

# Count files
AI_COUNT=$(ls "$PUBLIC_DIR"/*.ai 2>/dev/null | wc -l)
PNG_COUNT=$(ls "$PUBLIC_DIR"/*.png 2>/dev/null | grep -c "___Hafs39__DM" || true)

echo "📊 Status:"
echo "  AI files: $AI_COUNT"
echo "  PNG files: $PNG_COUNT"
echo ""

if [ "$PNG_COUNT" -eq "$AI_COUNT" ]; then
    echo "✅ All files already converted!"
    exit 0
fi

echo "🔄 Starting conversion...\n"

if [ "$CONVERSION_METHOD" == "ghostscript" ] || [ "$CONVERSION_METHOD" == "gs" ]; then
    echo "Using Ghostscript (recommended for quality)"
    
    # Check if gs is installed
    if ! command -v gs &> /dev/null; then
        echo "❌ Ghostscript not found. Installing..."
        sudo apt-get update
        sudo apt-get install -y ghostscript
    fi
    
    cd "$PUBLIC_DIR"
    total=0
    for f in *___Hafs39__DM.ai; do
        [ -e "$f" ] || break  # no matches
        
        png_file="${f%.ai}.png"
        
        if [ -f "$png_file" ]; then
            # echo "⏭️  Skipping $png_file (already exists)"
            true
        else
            echo -n "Converting $f... "
            gs -q -dNOPAUSE -dBATCH -dSAFER \
               -sDEVICE=pngalpha \
               -r150 \
               -sOutputFile="$png_file" \
               "$f" 2>/dev/null
            echo "✅"
            total=$((total + 1))
        fi
    done
    echo ""
    echo "✅ Conversion complete: $total new files"

elif [ "$CONVERSION_METHOD" == "imagemagick" ] || [ "$CONVERSION_METHOD" == "convert" ]; then
    echo "Using ImageMagick"
    
    # Check if convert is installed
    if ! command -v convert &> /dev/null; then
        echo "❌ ImageMagick not found. Installing..."
        sudo apt-get update
        sudo apt-get install -y imagemagick
    fi
    
    cd "$PUBLIC_DIR"
    echo "Converting all files with mogrify..."
    mogrify -format png -density 150 *___Hafs39__DM.ai
    echo "✅ Conversion complete"

else
    echo "❌ Unknown method: $CONVERSION_METHOD"
    echo ""
    echo "Usage: $0 [ghostscript|imagemagick]"
    echo "  ghostscript  - HighQuality (recommended)"
    echo "  imagemagick  - Faster, parallel processing"
    exit 1
fi

# Verify
FINAL_PNG=$(ls "$PUBLIC_DIR"/*.png 2>/dev/null | grep -c "___Hafs39__DM" || true)
echo ""
echo "✨ Final Count: $FINAL_PNG PNG files"

if [ "$FINAL_PNG" -eq "604" ]; then
    echo "🎉 Perfect! All 604 pages converted and ready!"
else
    echo "⚠️  Note: Expected 604 files, found $FINAL_PNG"
fi

echo ""
echo "📝 Next steps:"
echo "1. Restart dev server: npm run dev"
echo "2. Open Quran tab in the app"
echo "3. Enjoy reading the Quran! 📖🌙"
