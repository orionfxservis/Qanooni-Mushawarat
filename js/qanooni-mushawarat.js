// js/qanooni-mushawarat.js
// Consolidated global namespace module for Qanooni Mushawarat database & auth interactions

const QanooniMushawarat = {
    supabaseUrl: "https://aywuxnimzuqmocjccvbv.supabase.co",
    supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5d3V4bmltenVxbW9jamNjdmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMjAwMjAsImV4cCI6MjA5NTY5NjAyMH0.sEvlzk-Vl4TwS5rpR9mqcZ4AHE1RZgxOt9gPG6PJieQ",
    client: null,

    // Initialize client connection
    init() {
        if (!window.supabase) {
            console.error("[QanooniMushawarat] Supabase SDK script is missing!");
            return;
        }
        this.client = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
        window.supabaseClient = this.client;
        window.supabase = this.client;
        console.log("[QanooniMushawarat] Supabase client initialized successfully.");
    },

    // 1. Schema-safe Authentication & Role Loader
    async login(inputVal, password) {
        if (!this.client) this.init();
        let userData = null;

        // Check local storage fallback first
        try {
            let localLawyers = JSON.parse(localStorage.getItem('registeredLawyers')) || [];
            let localLawyer = localLawyers.find(l => l.user_id === inputVal || l.email === inputVal);
            if (localLawyer && (!localLawyer.password || localLawyer.password === password)) {
                userData = {
                    account_status: (localLawyer.status === 'Verified Lawyer' || localLawyer.status === 'Approved') ? 'active' : 'pending',
                    role: 'lawyer',
                    full_name: localLawyer.name,
                    profession: 'Lawyer',
                    email: localLawyer.email,
                    assigned_tasks: localLawyer.assigned_tasks || '',
                    is_local: true,
                    local_password: localLawyer.password
                };
            }
        } catch (e) {
            console.error("Local lawyer storage fallback error:", e);
        }

        if (!userData) {
            let userQuery = this.client.from('users').select('account_status, role, full_name, profession, email');
            let lawyerQuery = this.client.from('lawyer_registration').select('status, full_name, specialization, email, license_no');

            if (inputVal.includes('@')) {
                userQuery = userQuery.eq('email', inputVal);
                lawyerQuery = lawyerQuery.eq('email', inputVal);
            } else {
                userQuery = userQuery.ilike('email', `${inputVal}@%`);
                lawyerQuery = lawyerQuery.ilike('email', `${inputVal}@%`);
            }

            const { data: users, error: userError } = await userQuery.eq('project', 'Qanooni-Mushawarat');
            if (userError) throw userError;

            if (users && users.length > 0) {
                userData = users[0];
            } else {
                const { data: lawyers, error: lawyerError } = await lawyerQuery.eq('project', 'Qanooni-Mushawarat');
                if (lawyerError) throw lawyerError;

                if (lawyers && lawyers.length > 0) {
                    const lawyer = lawyers[0];
                    userData = {
                        account_status: (lawyer.status === 'Verified Lawyer' || lawyer.status === 'Approved') ? 'active' : 'pending',
                        role: 'lawyer',
                        full_name: lawyer.full_name,
                        profession: 'Lawyer',
                        email: lawyer.email,
                        assigned_tasks: ''
                    };
                }
            }
        }

        if (!userData) {
            throw new Error("User not found or invalid credentials.");
        }

        // Authenticate credentials via Supabase Auth
        if (!userData.is_local || !userData.local_password) {
            const { error: authError } = await this.client.auth.signInWithPassword({
                email: userData.email,
                password: password
            });
            if (authError) throw authError;
        }

        return userData;
    },

    // 2. Register normal user
    async registerUser(payload) {
        if (!this.client) this.init();
        const { error } = await this.client.from('users').insert([payload]);
        if (error) throw error;
    },

    // 3. Register advocate application
    async registerLawyer(payload) {
        if (!this.client) this.init();
        const { error } = await this.client.from('lawyer_registration').insert([payload]);
        if (error) throw error;
    },

    // 4. Load advocate profile details
    async loadLawyerProfile(email) {
        if (!this.client) this.init();
        const { data, error } = await this.client
            .from('lawyer_registration')
            .select('*')
            .eq('email', email);

        if (error) throw error;
        if (!data || data.length === 0) return null;

        const lawyer = data[0];
        let profile = {};
        try {
            if (lawyer.bio && (lawyer.bio.startsWith('{') || lawyer.bio.startsWith('['))) {
                profile = JSON.parse(lawyer.bio);
            } else {
                profile = { bioText: lawyer.bio || '' };
            }
        } catch(e) {
            profile = { bioText: lawyer.bio || '' };
        }

        // Map database-level fallback fields if missing in JSON
        profile.cnic = lawyer.cnic || '';
        profile.full_name = lawyer.full_name || '';
        profile.license_no = lawyer.license_no || '';
        profile.phone = lawyer.phone || '';
        profile.city = lawyer.city || '';
        return profile;
    },

    // 5. Save/Sync advocate profile details
    async saveLawyerProfile(email, profileObj) {
        if (!this.client) this.init();
        const serializedBio = JSON.stringify(profileObj);

        // 1. Update lawyer_registration status
        const { error: regError } = await this.client
            .from('lawyer_registration')
            .update({
                bio: serializedBio,
                specialization: profileObj.practiceAreas[0] || '',
                experience: parseInt(profileObj.experience) || 0,
                city: profileObj.officeCity || ''
            })
            .eq('email', email);
        
        if (regError) throw regError;

        // 2. Safe check update users table (schema-safe)
        const userPayload = {
            full_name: profileObj.full_name || '',
            bio: serializedBio,
            specialization: profileObj.practiceAreas[0] || '',
            city: profileObj.officeCity || '',
            phone: profileObj.officePhone || '',
            profile_image: profileObj.profilePhoto || '',
            company_name: profileObj.lawFirm || '',
            company_address: profileObj.officeAddress || '',
            working_court: (profileObj.courts || []).join(', ')
        };

        const { data: userCheck } = await this.client
            .from('users')
            .select('email')
            .eq('email', email)
            .eq('project', 'Qanooni-Mushawarat');

        if (userCheck && userCheck.length > 0) {
            const { error: userError } = await this.client
                .from('users')
                .update(userPayload)
                .eq('email', email)
                .eq('project', 'Qanooni-Mushawarat');
            if (userError) throw userError;
        } else {
            // Auto-insert if record was only stored locally
            userPayload.email = email;
            userPayload.profession = 'Lawyer';
            userPayload.account_status = 'active';
            userPayload.user_role = 'lawyer';
            userPayload.role = 'lawyer';
            userPayload.project = 'Qanooni-Mushawarat';
            const { error: userError } = await this.client
                .from('users')
                .insert([userPayload]);
            if (userError) throw userError;
        }
    }
};
