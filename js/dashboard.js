// use existing supabase
async function getLawyerRegistrations() {
    try {
        const { data, error } = await supabase
            .from("lawyer_registration")
            .select("*");
        if (error) {
            console.error("Error fetching lawyer registrations:", error);
            return null;
        }
        return data;
    } catch (err) {
        console.error("Failed to query lawyer_registration:", err);
        return null;
    }
}