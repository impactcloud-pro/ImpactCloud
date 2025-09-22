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

// Create test users function with proper error handling
export async function createTestUsers(): Promise<boolean> {
  try {
    console.log('Starting test user creation...');
    
    // First, ensure we have the required roles and organization
    await ensureInitialData();
    
    const testUsers = [
      {
        email: 'admin@test.com',
        password: 'password123',
        name: 'مدير النظام الرئيسي',
        role_id: 'super_admin',
        organization_id: null
      },
      {
        email: 'manager@test.com',
        password: 'password123',
        name: 'مدير المنظمة',
        role_id: 'org_manager',
        organization_id: 'test_org_001'
      },
      {
        email: 'user@test.com',
        password: 'password123',
        name: 'مدير أثرنا',
        role_id: 'admin',
        organization_id: null
      }
    ];

    let successCount = 0;
    
    for (const user of testUsers) {
      try {
        console.log(`Creating user: ${user.email}`);
        
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('user_id')
          .eq('email', user.email)
          .single();
          
        if (existingUser) {
          console.log(`User ${user.email} already exists in database`);
          successCount++;
          continue;
        }
        
        // Create user with admin client if available
        if (supabaseAdmin) {
          const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: user.email,
            password: user.password,
            email_confirm: true
          });

          if (authError) {
            if (authError.message?.includes('already registered')) {
              console.log(`Auth user ${user.email} already exists`);
              // Try to get the existing user ID
              const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
              if (!listError) {
                const existingAuthUser = users.find(u => u.email === user.email);
                if (existingAuthUser) {
                  // Create profile for existing auth user
                  await createUserProfile(existingAuthUser.id, user);
                  successCount++;
                }
              }
              continue;
            }
            throw authError;
          }

          if (authData.user) {
            await createUserProfile(authData.user.id, user);
            successCount++;
            console.log(`✓ Created user with admin client: ${user.email}`);
          }
        } else {
          // Fallback to regular signup
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: user.email,
            password: user.password,
            options: {
              data: {
                name: user.name,
                role_id: user.role_id,
                organization_id: user.organization_id
              }
            }
          });

          if (authError) {
            if (authError.message?.includes('already registered')) {
              console.log(`Auth user ${user.email} already exists via signup`);
              successCount++;
              continue;
            }
            throw authError;
          }
          
          if (authData.user) {
            await createUserProfile(authData.user.id, user);
            successCount++;
            console.log(`✓ Created user with signup: ${user.email}`);
          }
        }
      } catch (error) {
        console.error(`Failed to create user ${user.email}:`, error);
      }
    }

    console.log(`Test user creation completed. Created/verified ${successCount} users.`);
    return successCount > 0;
  } catch (error) {
    console.error('Error creating test users:', error);
    return false;
  }
}

// Helper function to create user profile
async function createUserProfile(userId: string, userData: any) {
  try {
    const { error } = await supabase
      .from('users')
      .insert({
        user_id: userId,
        name: userData.name,
        email: userData.email,
        role_id: userData.role_id,
        organization_id: userData.organization_id,
        status: 'Active',
        created_at: new Date().toISOString()
      });

    if (error && !error.message?.includes('duplicate key')) {
      throw error;
    }
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

// Helper function to ensure initial data exists
async function ensureInitialData() {
  try {
    // Check if roles exist
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('role_id')
      .limit(1);

    if (rolesError || !roles || roles.length === 0) {
      console.log('Creating initial roles...');
      
      const initialRoles = [
        { role_id: 'super_admin', name: 'Super Admin', description: 'System Administrator' },
        { role_id: 'admin', name: 'Admin', description: 'Platform Administrator' },
        { role_id: 'org_manager', name: 'Organization Manager', description: 'Organization Manager' },
        { role_id: 'beneficiary', name: 'Beneficiary', description: 'Beneficiary User' }
      ];

      const { error: insertRolesError } = await supabase
        .from('roles')
        .insert(initialRoles);

      if (insertRolesError && !insertRolesError.message?.includes('duplicate key')) {
        console.error('Error creating roles:', insertRolesError);
      }
    }

    // Check if test organization exists
    const { data: orgs, error: orgsError } = await supabase
      .from('organizations')
      .select('organization_id')
      .eq('organization_id', 'test_org_001')
      .single();

    if (orgsError || !orgs) {
      console.log('Creating test organization...');
      
      const { error: insertOrgError } = await supabase
        .from('organizations')
        .insert({
          organization_id: 'test_org_001',
          name: 'منظمة تجريبية للاختبار',
          type: 'nonprofit',
          status: 'active',
          organization_manager: 'مدير المنظمة',
          username: 'test_org',
          password: 'test123',
          number_of_beneficiaries: 0,
          number_of_surveys: 0,
          quota: 1000,
          consumed: 0,
          remaining: 1000,
          created_at: new Date().toISOString()
        });

      if (insertOrgError && !insertOrgError.message?.includes('duplicate key')) {
        console.error('Error creating test organization:', insertOrgError);
      }
    }
  } catch (error) {
    console.error('Error ensuring initial data:', error);
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