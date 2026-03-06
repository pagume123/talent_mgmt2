interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
    const percentage = ((currentStep + 1) / totalSteps) * 100;

    return (
        <div className="w-full h-1 bg-gray-100 mb-12">
            <div
                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
