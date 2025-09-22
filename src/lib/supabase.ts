import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://opzxyqfxsqtgfzcnkkoj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wenh5cWZ4c3F0Z2Z6Y25ra29qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NTc0OTMsImV4cCI6MjA3NDAzMzQ5M30.4pFvpIshRQqg5pYtKsPlL6TVw3j3-jpXqovilX0T_nk';

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


// Create test users function
export async function createTestUsers() {
  try {
    // Create a single test user
    const testUser = {
      email: 'admin@test.com',
      password: 'TestPass123!',
      userData: {
        user_id: 'test_admin_001',
        name: 'مدير النظام التجريبي',
        role_id: 'admin',
        status: 'Active'
      }
    };

    console.log('Creating test user...');
    
    try {
      // Try to sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testUser.email,
        password: testUser.password,
        options: {
          emailRedirectTo: undefined,
          data: testUser.userData
        }
      });

      if (authError && !authError.message.includes('already registered')) {
        console.error(`Error creating user ${testUser.email}:`, authError);
        return false;
      }

      // If user was created or already exists, ensure profile exists
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .upsert({
            user_id: authData.user.id,
            email: testUser.email,
            ...testUser.userData,
            created_at: new Date().toISOString()
          });

        if (profileError) {
          console.error(`Error creating profile for ${testUser.email}:`, profileError);
          return false;
        } else {
          console.log(`✓ Test user created: ${testUser.email}`);
        }
      }
    } catch (error) {
      console.error(`Failed to create user ${testUser.email}:`, error);
      return false;
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
    // Test basic connection using auth session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
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