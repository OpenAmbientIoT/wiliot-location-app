import {useLayoutEffect, useState} from "react";
import {debounce} from "../../../../utils/helpers";

const {log, group, groupEnd} = console;

const consoleIt = (func, ...options) => true && func(...options);

const RATIO_TOLERANCE = 0.01;

const useChildScaleToFitParent = (
    parentRef,
    childRef,
    isPortrait
) => {
    const [scale, setScale] = useState(1);

    const setMaxScale = (num) => setScale(Math.min(num, 1));

    const getSizes = () => {
        consoleIt(log, "\n\n");
        consoleIt(group, "Sizes");
        const {offsetHeight: parentH = 0, offsetWidth: parentW = 0} =
        parentRef.current ?? {};
        consoleIt(log, "Parent size:", {parentH, parentW});

        const {offsetHeight: childH = 0, offsetWidth: childW = 0} =
        childRef.current ?? {};
        consoleIt(log, "Child size:", {childH, childW});
        consoleIt(groupEnd);

        const isPPortrait = parentH > parentW;
        const isCPortrait = childH > childW;

        consoleIt(log, {isPPortrait, isCPortrait});

        if (isPPortrait && !isCPortrait) {
            const wRatio = parentW / childW - RATIO_TOLERANCE;
            consoleIt(log, {wRatio});
            setMaxScale(wRatio);
        }

        if (isPPortrait && isCPortrait) {
            const wRatio = parentW / childW - RATIO_TOLERANCE;
            const hRatio = parentH / childH - RATIO_TOLERANCE;

            if (childH * (wRatio + RATIO_TOLERANCE) >= parentH) setMaxScale(hRatio);
            else setMaxScale(wRatio);
        } else if (!isPPortrait && isCPortrait) {
            const hRatio = parentH / childH - RATIO_TOLERANCE;
            consoleIt(log, {hRatio});
            setMaxScale(hRatio);
        } else if (!isPPortrait && !isCPortrait) {
            const hRatio = parentH / childH - RATIO_TOLERANCE;
            const wRatio = parentW / childW - RATIO_TOLERANCE;

            if (childW * (hRatio + RATIO_TOLERANCE) >= parentW) setMaxScale(wRatio);
            else setMaxScale(hRatio);
        }

        consoleIt(log, "\n\n");

        // return { parentH, parentW, childH, childW, isPPortrait, isCPortrait, };
    };

    useLayoutEffect(() => {
        getSizes();

        window.addEventListener("resize", debounce(getSizes, 500));

        return () => window.removeEventListener("resize", debounce(getSizes, 500));
    }, [isPortrait]);

    const recalculateScaleCallback = () => {
        getSizes();
    }

    return {scale, recalculateScaleCallback};
};

export default useChildScaleToFitParent;
