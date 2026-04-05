#!/usr/bin/env bash
set -euo pipefail

MAX_WIDTH=2048
THUMB_SIZE=800
PHOTO_DIR="public/photos"
THUMB_DIR="public/photos/thumbs"
CONTENT_DIR="src/content/photos"
TODAY=$(date +%Y-%m-%d)

META_CAMERA_MAKE="" META_CAMERA_MODEL="" META_DATE_TAKEN=""
META_GPS_LAT="" META_GPS_LON="" META_FOCAL_LENGTH=""
META_APERTURE="" META_ISO="" META_EXPOSURE=""
META_WIDTH="" META_HEIGHT=""
META_DATE_HINT="" META_LOCATION_HINT=""

usage() {
  cat <<'EOF'
Usage:
  ./scripts/process-photo.sh <image-file>
  ./scripts/process-photo.sh --multi [--slug <name>] <file1> <file2> [...]

Single mode:
  Processes one image into a photo content page.
  Slug is derived from the filename.

Multi mode:
  Processes multiple images into a comparison/series page.
  Use --slug to set the page slug (required for multi).

Options:
  --multi          Multi-image mode
  --slug <name>    Override the slug (required for --multi)
  --help           Show this help

Examples:
  ./scripts/process-photo.sh inbox/1806-philly-navy-yard.jpg
  ./scripts/process-photo.sh --multi --slug stacks-comparison \
    inbox/0302-stacks.jpg inbox/2603-stacks/IMG_4205.heic
EOF
  exit 0
}

slug_from_filename() {
  local base
  base=$(basename "$1")
  base="${base%.*}"
  echo "$base" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//'
}

mdls_field() {
  local key="$1" src="$2"
  local raw
  raw=$(mdls -raw -name "$key" "$src" 2>/dev/null) || return 0
  [[ "$raw" == "(null)" ]] && return 0
  echo "$raw"
}

extract_exif() {
  local src="$1"
  META_CAMERA_MAKE=$(mdls_field kMDItemAcquisitionMake "$src")
  META_CAMERA_MODEL=$(mdls_field kMDItemAcquisitionModel "$src")
  META_DATE_TAKEN=$(mdls_field kMDItemContentCreationDate "$src")
  META_GPS_LAT=$(mdls_field kMDItemLatitude "$src")
  META_GPS_LON=$(mdls_field kMDItemLongitude "$src")
  META_FOCAL_LENGTH=$(mdls_field kMDItemFocalLength "$src")
  META_APERTURE=$(mdls_field kMDItemFNumber "$src")
  META_EXPOSURE=$(mdls_field kMDItemExposureTimeSeconds "$src")
  META_WIDTH=$(mdls_field kMDItemPixelWidth "$src")
  META_HEIGHT=$(mdls_field kMDItemPixelHeight "$src")
  # ISO is stored as an array in Spotlight; extract the first numeric value
  META_ISO=$(mdls -name kMDItemISOSpeed "$src" 2>/dev/null \
    | awk '/[0-9]/{gsub(/[^0-9.]/,"",$1); if($1+0>0) print $1; exit}') || true
}

parse_filename() {
  local slug="$1"
  META_DATE_HINT=""
  META_LOCATION_HINT=""
  if [[ "$slug" =~ ^([0-9]{2})([0-9]{2})-(.+) ]]; then
    META_DATE_HINT="20${BASH_REMATCH[1]}-${BASH_REMATCH[2]}"
    local rest="${BASH_REMATCH[3]}"
    rest=$(echo "$rest" | sed 's/-[0-9]*$//')
    META_LOCATION_HINT=$(echo "$rest" | sed 's/-/ /g' \
      | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)}1')
  fi
}

format_metadata_block() {
  local slug="$1"
  echo ""
  echo "<!-- EXTRACTED METADATA"
  echo "filename: ${slug}"
  [[ -n "$META_DATE_HINT" ]] && echo "date_hint: ${META_DATE_HINT} (from filename)"
  [[ -n "$META_LOCATION_HINT" ]] && echo "location_hint: ${META_LOCATION_HINT} (from filename)"
  [[ -n "$META_CAMERA_MAKE$META_CAMERA_MODEL" ]] && echo "camera: ${META_CAMERA_MAKE} ${META_CAMERA_MODEL}"
  [[ -n "$META_DATE_TAKEN" ]] && echo "date_taken: ${META_DATE_TAKEN}"
  [[ -n "$META_GPS_LAT" && -n "$META_GPS_LON" ]] && echo "gps: ${META_GPS_LAT}, ${META_GPS_LON}"
  [[ -n "$META_FOCAL_LENGTH" ]] && echo "focal_length: ${META_FOCAL_LENGTH}mm"
  [[ -n "$META_APERTURE" ]] && echo "aperture: f/${META_APERTURE}"
  [[ -n "$META_ISO" ]] && echo "iso: ${META_ISO}"
  [[ -n "$META_EXPOSURE" ]] && echo "exposure: ${META_EXPOSURE}s"
  [[ -n "$META_WIDTH" && -n "$META_HEIGHT" ]] && echo "dimensions: ${META_WIDTH}x${META_HEIGHT}"
  echo "-->"
}

print_metadata_summary() {
  local slug="$1"
  echo ""
  echo "Extracted metadata for ${slug}:"
  echo "  ─────────────────────────────────"
  [[ -n "$META_DATE_HINT" ]] && echo "  Date (filename):   ${META_DATE_HINT}"
  [[ -n "$META_LOCATION_HINT" ]] && echo "  Location (filename): ${META_LOCATION_HINT}"
  [[ -n "$META_CAMERA_MAKE$META_CAMERA_MODEL" ]] && echo "  Camera:            ${META_CAMERA_MAKE} ${META_CAMERA_MODEL}"
  [[ -n "$META_DATE_TAKEN" ]] && echo "  Date taken:        ${META_DATE_TAKEN}"
  [[ -n "$META_GPS_LAT" && -n "$META_GPS_LON" ]] && echo "  GPS:               ${META_GPS_LAT}, ${META_GPS_LON}"
  [[ -n "$META_FOCAL_LENGTH" ]] && echo "  Focal length:      ${META_FOCAL_LENGTH}mm"
  [[ -n "$META_APERTURE" ]] && echo "  Aperture:          f/${META_APERTURE}"
  [[ -n "$META_ISO" ]] && echo "  ISO:               ${META_ISO}"
  [[ -n "$META_EXPOSURE" ]] && echo "  Exposure:          ${META_EXPOSURE}s"
  [[ -n "$META_WIDTH" && -n "$META_HEIGHT" ]] && echo "  Dimensions:        ${META_WIDTH}x${META_HEIGHT}"
  echo "  ─────────────────────────────────"
}

process_image() {
  local src="$1"
  local dest="$2"
  local thumb_dest="$3"

  local ext="${src##*.}"
  local ext_lower
  ext_lower=$(echo "$ext" | tr '[:upper:]' '[:lower:]')

  local tmp_file
  tmp_file=$(mktemp /tmp/photo-process-XXXXXX.jpg)

  if [[ "$ext_lower" == "heic" || "$ext_lower" == "heif" ]]; then
    echo "  Converting HEIC → JPEG..."
    sips -s format jpeg "$src" --out "$tmp_file" >/dev/null 2>&1
  else
    cp "$src" "$tmp_file"
  fi

  local width
  width=$(sips -g pixelWidth "$tmp_file" 2>/dev/null | awk '/pixelWidth/{print $2}')
  local height
  height=$(sips -g pixelHeight "$tmp_file" 2>/dev/null | awk '/pixelHeight/{print $2}')

  if [[ "$width" -gt "$MAX_WIDTH" || "$height" -gt "$MAX_WIDTH" ]]; then
    echo "  Resizing to max ${MAX_WIDTH}px (was ${width}x${height})..."
    sips -Z "$MAX_WIDTH" "$tmp_file" --out "$dest" >/dev/null 2>&1
  else
    echo "  Already under ${MAX_WIDTH}px (${width}x${height}), copying..."
    cp "$tmp_file" "$dest"
  fi

  echo "  Creating thumbnail (${THUMB_SIZE}px)..."
  sips -Z "$THUMB_SIZE" "$dest" --out "$thumb_dest" >/dev/null 2>&1

  rm -f "$tmp_file"

  local final_w final_h
  final_w=$(sips -g pixelWidth "$dest" 2>/dev/null | awk '/pixelWidth/{print $2}')
  final_h=$(sips -g pixelHeight "$dest" 2>/dev/null | awk '/pixelHeight/{print $2}')
  echo "  → ${dest} (${final_w}x${final_h})"

  local thumb_w thumb_h
  thumb_w=$(sips -g pixelWidth "$thumb_dest" 2>/dev/null | awk '/pixelWidth/{print $2}')
  thumb_h=$(sips -g pixelHeight "$thumb_dest" 2>/dev/null | awk '/pixelHeight/{print $2}')
  echo "  → ${thumb_dest} (${thumb_w}x${thumb_h})"
}

scaffold_single() {
  local slug="$1"
  local image_path="$2"
  local md_file="${CONTENT_DIR}/${slug}.md"

  if [[ -f "$md_file" ]]; then
    echo "  ⚠ ${md_file} already exists, skipping scaffold"
    return
  fi

  cat > "$md_file" <<FRONTMATTER
---
title: "${slug}"
date: ${TODAY}
image: "${image_path}"
alt: "TODO: describe this image for screen readers"
location: ""
description: "TODO: short description for cards and meta tags"
tags: []
featured: false
draft: true
category: "observation"
paceLayers: []
---

TODO: Editorial analysis goes here.
FRONTMATTER

  format_metadata_block "$slug" >> "$md_file"
  echo "  → ${md_file} (draft)"
}

scaffold_multi() {
  local slug="$1"
  shift
  local -a image_paths=("$@")
  local md_file="${CONTENT_DIR}/${slug}.md"

  if [[ -f "$md_file" ]]; then
    echo "  ⚠ ${md_file} already exists, skipping scaffold"
    return
  fi

  local images_yaml=""
  local i=1
  for img_path in "${image_paths[@]}"; do
    images_yaml+="  - src: \"${img_path}\"
    alt: \"TODO: describe image ${i} for screen readers\"
    caption: \"TODO: caption for image ${i}\"
"
    i=$((i + 1))
  done

  cat > "$md_file" <<FRONTMATTER
---
title: "${slug}"
date: ${TODAY}
image: "${image_paths[0]}"
alt: "TODO: describe primary image for screen readers"
images:
${images_yaml}location: ""
description: "TODO: short description for cards and meta tags"
tags: []
featured: false
draft: true
category: "observation"
paceLayers: []
---

TODO: Editorial analysis comparing these images goes here.
FRONTMATTER

  format_metadata_block "$slug" >> "$md_file"
  echo "  → ${md_file} (draft, multi-image)"
}

# --- Parse arguments ---

MULTI=false
SLUG=""
FILES=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --multi) MULTI=true; shift ;;
    --slug) SLUG="$2"; shift 2 ;;
    --help|-h) usage ;;
    *) FILES+=("$1"); shift ;;
  esac
done

if [[ ${#FILES[@]} -eq 0 ]]; then
  echo "Error: No image files provided."
  usage
fi

for f in "${FILES[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "Error: File not found: $f"
    exit 1
  fi
done

mkdir -p "$PHOTO_DIR" "$THUMB_DIR" "$CONTENT_DIR"

# --- Single mode ---

if [[ "$MULTI" == false ]]; then
  if [[ ${#FILES[@]} -ne 1 ]]; then
    echo "Error: Single mode expects exactly one file. Use --multi for multiple files."
    exit 1
  fi

  src="${FILES[0]}"
  [[ -z "$SLUG" ]] && SLUG=$(slug_from_filename "$src")

  echo "Processing single image: $src → $SLUG"

  extract_exif "$src"
  parse_filename "$SLUG"

  dest="${PHOTO_DIR}/${SLUG}.jpg"
  thumb="${THUMB_DIR}/${SLUG}.jpg"

  process_image "$src" "$dest" "$thumb"

  echo ""
  echo "Scaffolding content..."
  scaffold_single "$SLUG" "/photos/${SLUG}.jpg"

  print_metadata_summary "$SLUG"

  echo ""
  echo "Done! Edit ${CONTENT_DIR}/${SLUG}.md to add title, description, and editorial text."
  exit 0
fi

# --- Multi mode ---

if [[ -z "$SLUG" ]]; then
  echo "Error: --slug is required in multi mode."
  exit 1
fi

if [[ ${#FILES[@]} -lt 2 ]]; then
  echo "Error: Multi mode requires at least 2 files."
  exit 1
fi

echo "Processing multi-image set: $SLUG (${#FILES[@]} images)"

extract_exif "${FILES[0]}"
parse_filename "$SLUG"

image_paths=()
i=1
for src in "${FILES[@]}"; do
  echo ""
  echo "Image ${i}: $src"
  dest="${PHOTO_DIR}/${SLUG}-${i}.jpg"
  thumb="${THUMB_DIR}/${SLUG}-${i}.jpg"

  process_image "$src" "$dest" "$thumb"
  image_paths+=("/photos/${SLUG}-${i}.jpg")
  i=$((i + 1))
done

echo ""
echo "Scaffolding content..."
scaffold_multi "$SLUG" "${image_paths[@]}"

print_metadata_summary "$SLUG"

echo ""
echo "Done! Edit ${CONTENT_DIR}/${SLUG}.md to add title, description, and editorial text."
