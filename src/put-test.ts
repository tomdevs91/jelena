// Test script for PUT /api/customers/[id] endpoint
// Usage: npm run dev put-test.ts or ts-node put-test.ts

const API_BASE = 'http://localhost:3000/api';

interface UpdateCustomerData {
  name: string;
  email: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface ErrorResponse {
  message: string;
}

async function updateCustomer(id: number, data: UpdateCustomerData): Promise<void> {
  try {
    console.log(`🔄 Updating customer ${id}...`);
    console.log('📤 Request data:', JSON.stringify(data, null, 2));
    
    const response = await fetch(`${API_BASE}/customers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    console.log(`📊 Response status: ${response.status} ${response.statusText}`);

    const responseData = await response.json();
    
    if (response.ok) {
      console.log('✅ Customer updated successfully!');
      console.log('📥 Response data:', JSON.stringify(responseData, null, 2));
    } else {
      console.log('❌ Error updating customer:');
      console.log('📥 Error response:', JSON.stringify(responseData, null, 2));
    }
  } catch (error) {
    console.error('🚨 Network error:', error);
  }
}

// Test cases
async function runTests() {
  console.log('🚀 Starting PUT endpoint tests...\n');

  // Test 1: Update existing customer (assuming customer with ID 1 exists)
  await updateCustomer(1, {
    name: 'Testic',
    email: 'testic-test@gmail.com'
  });

  console.log('\n' + '='.repeat(50) + '\n');

  

  console.log('\n✨ Tests completed!');
}

// Run the tests
runTests().catch(console.error); 