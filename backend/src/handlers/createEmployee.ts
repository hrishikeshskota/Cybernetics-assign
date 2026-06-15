import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { docClient, TABLE_NAME } from '../lib/dynamo';
import type { EmployeeInput } from '../lib/employee';
import { normalizeInput, validateEmployeeInput } from '../lib/employee';
import { badRequest, created, serverError } from '../lib/response';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body) {
    return badRequest('Request body is required');
  }

  let input: EmployeeInput;
  try {
    input = JSON.parse(event.body) as EmployeeInput;
  } catch {
    return badRequest('Invalid JSON body');
  }

  const validationError = validateEmployeeInput(input);
  if (validationError) {
    return badRequest(validationError);
  }

  const normalized = normalizeInput(input);
  const now = new Date().toISOString();
  const employee = {
    id: uuidv4(),
    ...normalized,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: employee,
        ConditionExpression: 'attribute_not_exists(id)',
      }),
    );

    return created({ employee });
  } catch (error) {
    console.error('CreateEmployee error:', error);
    return serverError('Failed to create employee');
  }
};
