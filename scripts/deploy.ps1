$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $PSScriptRoot
$StackName = if ($env:STACK_NAME) { $env:STACK_NAME } else { "employee-management" }
$Region = if ($env:AWS_REGION) { $env:AWS_REGION } else { "us-east-1" }

Write-Host "==> Building and deploying AWS stack..."
Set-Location $RootDir
sam build
sam deploy --no-confirm-changeset --no-fail-on-empty-changeset

Write-Host "==> Reading stack outputs..."
$Outputs = aws cloudformation describe-stacks `
  --stack-name $StackName `
  --region $Region `
  --query "Stacks[0].Outputs" `
  --output json | ConvertFrom-Json

function Get-Output($Key) {
  return ($Outputs | Where-Object { $_.OutputKey -eq $Key }).OutputValue
}

$ApiUrl = Get-Output "ApiEndpoint"
$Bucket = Get-Output "FrontendBucketName"
$DistributionId = Get-Output "CloudFrontDistributionId"
$CloudFrontUrl = Get-Output "CloudFrontUrl"

Write-Host "==> Building frontend..."
Set-Location "$RootDir\frontend"
npm ci
$env:VITE_API_URL = $ApiUrl
npm run build

Write-Host "==> Uploading frontend to S3..."
aws s3 sync dist/ "s3://$Bucket/" --delete --cache-control "public,max-age=31536000,immutable" --exclude "index.html"
aws s3 cp dist/index.html "s3://$Bucket/index.html" --cache-control "public,max-age=0,must-revalidate"

Write-Host "==> Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $DistributionId --paths "/*" | Out-Null

Write-Host ""
Write-Host "Deployment complete!"
Write-Host "API URL:       $ApiUrl"
Write-Host "Website URL:   $CloudFrontUrl"
