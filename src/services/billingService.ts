import { supabase } from '../lib/supabase';
import { createId } from '../utils/supabaseHelpers';
import { logActivity } from './database';

export interface TransactionData {
  transaction_id: string;
  organization_id: string;
  payment_method: string;
  date: string;
  total: number;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  invoice_number?: string;
}

export async function createTransaction(transactionData: Omit<TransactionData, 'transaction_id'>) {
  try {
    const transaction_id = createId('txn_');
    
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        transaction_id,
        ...transactionData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Log activity
    await logActivity({
      log_id: createId('log_'),
      organization_id: transactionData.organization_id,
      action: 'إنشاء معاملة مالية',
      details: `تم إنشاء معاملة بقيمة ${transactionData.total} ريال`,
      ip_address: null,
      user_agent: navigator.userAgent
    });

    return data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}

export async function getTransactionsByOrganization(organization_id: string) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('organization_id', organization_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

export async function updateTransactionStatus(transaction_id: string, status: 'pending' | 'completed' | 'failed') {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update({ status })
      .eq('transaction_id', transaction_id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating transaction status:', error);
    throw error;
  }
}

export async function processPayment(paymentData: {
  organization_id: string;
  plan_id: string;
  amount: number;
  payment_method: string;
  payment_details: any;
}) {
  try {
    // Create transaction record
    const transaction = await createTransaction({
      organization_id: paymentData.organization_id,
      payment_method: paymentData.payment_method,
      date: new Date().toISOString().split('T')[0],
      total: paymentData.amount,
      status: 'pending',
      description: `اشتراك في خطة ${paymentData.plan_id}`,
      invoice_number: `INV-${Date.now()}`
    });

    // Here you would integrate with actual payment processors
    // For now, we'll simulate successful payment
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update transaction status
    await updateTransactionStatus(transaction.transaction_id, 'completed');

    // Update organization subscription
    await supabase
      .from('organizations')
      .update({ plan_id: paymentData.plan_id })
      .eq('organization_id', paymentData.organization_id);

    return transaction;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
}

export async function generateInvoice(transaction_id: string) {
  try {
    const { data: transaction, error } = await supabase
      .from('transactions')
      .select(`
        *,
        organizations(name, organization_manager)
      `)
      .eq('transaction_id', transaction_id)
      .single();

    if (error) throw error;

    // Generate invoice data
    const invoiceData = {
      invoiceNumber: transaction.invoice_number,
      date: transaction.date,
      organizationName: transaction.organizations?.name,
      amount: transaction.total,
      paymentMethod: transaction.payment_method,
      status: transaction.status
    };

    return invoiceData;
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
}