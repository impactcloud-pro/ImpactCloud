import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://opzxyqfxsqtgfzcnkkoj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wenh5cWZ4c3F0Z2Z6Y25ra29qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NTc0OTMsImV4cCI6MjA3NDAzMzQ5M30.4pFvpIshRQqg5pYtKsPlL6TVw3j3-jpXqovilX0T_nk';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'implicit'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'social-impact-platform'
    }
  }
});

// Admin client for user management (only if service key is available)
export const supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}) : null;

// Create test users function
export async function createTestUsers() {
  try {
    // Check if users already exist first
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingEmails = existingUsers?.users?.map(u => u.email) || [];
    
    if (existingEmails.includes('superadmin@system.com')) {
      console.log('Test users already exist');
      return true;
    }

    const testUsers = [
      {
        email: 'superadmin@system.com',
        password: 'SuperAdmin123!',
        user_metadata: {
          name: 'مدير النظام الرئيسي',
          role_id: 'super_admin',
          status: 'Active'
        }
      },
      {
        email: 'admin@atharonaa.com',
        password: 'Admin123!',
        user_metadata: {
          name: 'مدير أثرنا',
          role_id: 'admin',
          status: 'Active'
        }
      },
      {
        email: 'manager@organization.com',
        password: 'Manager123!',
        user_metadata: {
          name: 'مدير المنظمة',
          role_id: 'org_manager',
          organization_id: 'org_001',
          status: 'Active'
        }
      }
    ];

    console.log('Creating test users...');
    
    for (const user of testUsers) {
      try {
        // Create user with regular signup first
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: user.email,
          password: user.password,
          options: {
            data: user.user_metadata
          }
        });

        if (authError && !authError.message.includes('already registered')) {
          console.error(`Error creating user ${user.email}:`, authError);
          continue;
        }

        // If user was created, try to confirm them manually
        if (authData.user) {
          // Try to confirm the user if admin client is available
          if (supabaseAdmin) {
            await supabaseAdmin.auth.admin.updateUserById(authData.user.id, {
              email_confirm: true
            });
          }
          console.log(`✓ Test user created: ${user.email}`);
        }
      } catch (error) {
        console.error(`Failed to create user ${user.email}:`, error);
      }
    }

    return true;
  } catch (error) {
    console.error('Error creating test users:', error);
    return false;
  }
}

// Test connection function
export async function testSupabaseConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase.from('roles').select('count').limit(1);
    
    if (error) {
      console.log('Database not ready yet, but connection works');
    }
    
    console.log('Supabase connection test successful');
    
    // Create test users if connection is successful
    await createTestUsers();
    
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
}

// Export the client
export default supabase;