'use server';

import {
  submitCustomerInterest as submitCustomerInterestService,
  type CustomerInterestInput,
  type CustomerInterestResult,
} from '@/lib/customer-interest';

export type { CustomerInterestResult } from '@/lib/customer-interest';

export async function submitCustomerInterest(input: CustomerInterestInput): Promise<CustomerInterestResult> {
  return submitCustomerInterestService(input);
}
