import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '../lib/dynamo';
import type { EmployeeInput } from '../lib/employee';
import { normalizeInput, validateEmployeeInput } from '../lib/employee';
import { badRequest, notFound, ok, serverError } from '../lib/response';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const id = event.pathParameters?.id;
  if (!id) {
    return badRequest('Employee id is required');
  }

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

  try {
    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression:
          'SET firstName = :firstName, lastName = :lastName, email = :email, department = :department, #role = :role, hireDate = :hireDate, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#role': 'role',
        },
        ExpressionAttributeValues: {
          ':firstName': normalized.firstName,
          ':lastName': normalized.lastName,
          ':email': normalized.email,
          ':department': normalized.department,
          ':role': normalized.role,
          ':hireDate': normalized.hireDate,
          ':updatedAt': now,
        },
        ReturnValues: 'ALL_NEW',
        ConditionExpression: 'attribute_exists(id)',
      }),
    );

    return ok({ employee: result.Attributes });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ConditionalCheckFailedException') {
      return notFound('Employee not found');
    }
    console.error('UpdateEmployee error:', error);
    return serverError('Failed to update employee');
  }
};
