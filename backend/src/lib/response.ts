import type { APIGatewayProxyResultV2 } from 'aws-lambda';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Content-Type': 'application/json',
};

export function json(statusCode: number, body: unknown): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(body),
  };
}

export function ok(body: unknown): APIGatewayProxyResultV2 {
  return json(200, body);
}

export function created(body: unknown): APIGatewayProxyResultV2 {
  return json(201, body);
}

export function noContent(): APIGatewayProxyResultV2 {
  return {
    statusCode: 204,
    headers: CORS_HEADERS,
  };
}

export function badRequest(message: string): APIGatewayProxyResultV2 {
  return json(400, { error: message });
}

export function notFound(message = 'Not found'): APIGatewayProxyResultV2 {
  return json(404, { error: message });
}

export function serverError(message = 'Internal server error'): APIGatewayProxyResultV2 {
  return json(500, { error: message });
}
