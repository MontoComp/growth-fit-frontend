export enum EBreakpointsSizes {
    SMALL = "(min-width: 320px) and (max-width: 575.98px)",
    MEDIUM = "(min-width: 576px) and (max-width: 1439.98px)",
    LARGE = "(min-width: 1440px)",
}

export enum EBreakpoints {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large",
}

export const GrowthFitBreakpoints = {
    SMALL: {
        name: EBreakpoints.SMALL,
        breakpoint: EBreakpointsSizes.SMALL,
    },
    MEDIUM: {
        name: EBreakpoints.MEDIUM,
        breakpoint: EBreakpointsSizes.MEDIUM,
    },
    LARGE: {
        name: EBreakpoints.LARGE,
        breakpoint: EBreakpointsSizes.LARGE,
    },
}