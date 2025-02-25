const LoadingState = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
            <div
                key={i}
                className="h-24 rounded-lg animate-pulse bg-gray-200 dark:bg-gray-700"
            />
        ))}
    </div>
);

export default LoadingState;
