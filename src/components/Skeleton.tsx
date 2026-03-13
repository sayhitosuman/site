
export function SkeletonLine({ width = "100%", height = "1rem", margin = "0.5rem 0" }) {
    return (
        <div
            className="animate-pulse rounded-md"
            style={{
                width,
                height,
                margin,
                backgroundColor: "var(--color-rule)",
                opacity: 0.15
            }}
        />
    );
}

export function SkeletonCard() {
    return (
        <div className="border border-[var(--color-rule)] rounded-xl p-5 mb-4 bg-[rgba(255,255,255,0.02)] backdrop-blur-sm">
            <SkeletonLine width="45%" height="1.4rem" margin="0 0 1rem 0" />
            <SkeletonLine width="95%" height="0.8rem" margin="0.5rem 0" />
            <SkeletonLine width="80%" height="0.8rem" margin="0.5rem 0" />
            <div className="mt-4 pt-3 border-t border-[var(--color-rule)] flex justify-between">
                <SkeletonLine width="25%" height="0.6rem" margin="0" />
                <SkeletonLine width="15%" height="0.6rem" margin="0" />
            </div>
        </div>
    );
}

export function SkeletonList({ count = 3 }) {
    return (
        <div className="space-y-8">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex gap-5 items-start">
                    <div className="w-6 h-6 bg-[var(--color-rule)] animate-pulse rounded-md shrink-0 opacity-20" />
                    <div className="flex-1 space-y-3">
                        <SkeletonLine width="35%" height="1.1rem" margin="0" />
                        <SkeletonLine width="85%" height="0.9rem" margin="0" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function SkeletonGrid({ count = 6 }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="aspect-square bg-[var(--color-rule)] animate-pulse rounded-md opacity-20" />
            ))}
        </div>
    );
}
