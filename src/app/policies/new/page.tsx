import BilingualEditor from "@/components/policies/BilingualEditor";

export default function NewPolicyPage() {
    return (
        <div className="min-h-screen bg-[#F9FAFB] p-8 md:p-12 lg:p-16">
            <BilingualEditor archetype="Execution-First" />
        </div>
    );
}
