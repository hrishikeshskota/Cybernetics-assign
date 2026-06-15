#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STACK_NAME="${STACK_NAME:-employee-management}"
REGION="${AWS_REGION:-us-east-1}"

echo "==> Building and deploying AWS stack..."
cd "$ROOT_DIR"
sam build
sam deploy --no-confirm-changeset --no-fail-on-empty-changeset

echo "==> Reading stack outputs..."
API_URL=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" \
  --output text)

BUCKET=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='FrontendBucketName'].OutputValue" \
  --output text)

DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" \
  --output text)

CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontUrl'].OutputValue" \
  --output text)

echo "==> Building frontend..."
cd "$ROOT_DIR/frontend"
npm ci
VITE_API_URL="$API_URL" npm run build

echo "==> Uploading frontend to S3..."
aws s3 sync dist/ "s3://$BUCKET/" --delete --cache-control "public,max-age=31536000,immutable" \
  --exclude "index.html"
aws s3 cp dist/index.html "s3://$BUCKET/index.html" \
  --cache-control "public,max-age=0,must-revalidate"

echo "==> Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" >/dev/null

echo
echo "Deployment complete!"
echo "API URL:       $API_URL"
echo "Website URL:   $CLOUDFRONT_URL"
