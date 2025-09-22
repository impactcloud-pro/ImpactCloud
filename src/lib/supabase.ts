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
    const testUsers = [
      {
        email: 'admin@test.com',
        password: 'admin123',
        name: 'مدير النظام الرئيسي',
        role_id: 'super_admin'
      },
      {
        email: 'manager@test.com',
        password: 'manager123',
        name: 'مدير أثرنا',
        role_id: 'admin'
      },
      {
        email: 'org@test.com',
        password: 'org123',
        name: 'مدير المنظمة',
        role_id: 'org_manager'
      },
      {
        email: 'user@test.com',
        password: 'user123',
        name: 'مستفيد',
        role_id: 'beneficiary'
      }
    ];

    console.log('Creating test users...');
    
    for (const user of testUsers) {
      try {
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('email')
          .eq('email', user.email)
          .single();

        if (existingUser) {
          console.log(`User ${user.email} already exists`);
          continue;
        }

        // Use admin client to create confirmed user
        if (supabaseAdmin) {
          const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
            email: user.email,
            password: user.password,
            email_confirm: true,
            user_metadata: {
              name: user.name,
              role_id: user.role_id
            }
          });

          if (adminError) {
            console.error(`Admin create error for ${user.email}:`, adminError);
            continue;
          }

          // Create user profile in database
          if (adminData.user) {
            const { error: profileError } = await supabase
              .from('users')
              .insert({
                user_id: adminData.user.id,
                name: user.name,
                email: user.email,
                role_id: user.role_id,
                status: 'Active'
              });

            if (profileError) {
              console.error(`Profile creation error for ${user.email}:`, profileError);
            } else {
              console.log(`✓ Test user created successfully: ${user.email}`);
            }
          }
        } else {
          // Fallback: regular signup (will need manual confirmation)
          const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email: user.email,
            password: user.password,
            options: {
              data: {
                name: user.name,
                role_id: user.role_id
              }
            }
          });

          if (signupError && !signupError.message.includes('already registered')) {
            console.error(`Signup error for ${user.email}:`, signupError);
          } else if (signupData.user) {
            console.log(`✓ Test user signed up (needs confirmation): ${user.email}`);
          }
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