declare function loadTool(name: string);


// https://cnbj3-fusion.fds.api.xiaomi.com/miai-fe-aischedule-home-fe/tools/AIScheduleTools.js
// MD5: 6cc5b8eab04fbabffb8cecac20731071

/**
 *  @version 1.2.0216
 *  @line 231
 */
declare function AIScheduleAlert(data?: string | {
    titleText?: string,
    contentText?: string,
    confirmText?: string,
}): Promise<void>;

/**
 *  @version 1.2.0206
 *  @line 387
 */
declare function AIScheduleConfirm(data?: string | {
    titleText?: string,
    contentText?: string,
    confirmText?: string,
    cancelText?: string,
}): Promise<boolean>;

/**
 * @version 1.0.2
 * @line 348
 */
declare function AISchedulePrompt(data: {
    titleText?: string,
    tipText?: string,
    defaultText?: string,
    validator?: (text: string) => boolean,
}): Promise<string>;

/**
 * @version 1.0.0
 * @line 420
 */
declare function AIScheduleSelect(data?: {
    titleText?: string,
    contentText?: string,
    selectList?: [string],
}): Promise<string>;

/**
 * @line 450
 */
declare function AIScheduleLoading(data?: {
    titleText?: string,
    contentText?: string,
}): {
    show: () => void,
    close: () => void,
};
