#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STACK_NAME="${STACK_NAME:-employee-management}"
REGION="${AWS_REGION:-us-east-1}"

API_URL=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" \
  --output text)

echo "Seeding demo employees to $API_URL"

curl -s -X POST "$API_URL/employees" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Alice","lastName":"Johnson","email":"alice.johnson@company.com","department":"Engineering","role":"Senior Developer","hireDate":"2022-03-15"}'

curl -s -X POST "$API_URL/employees" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Bob","lastName":"Smith","email":"bob.smith@company.com","department":"Human Resources","role":"HR Manager","hireDate":"2021-06-01"}'

curl -s -X POST "$API_URL/employees" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Carol","lastName":"Williams","email":"carol.williams@company.com","department":"Marketing","role":"Marketing Lead","hireDate":"2023-01-10"}'

echo
echo "Seed data created."
