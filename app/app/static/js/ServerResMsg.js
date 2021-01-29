import * as Const from "./Constants.js";

function buildUnexpectedErrMsg(f) {
    return function () {
        let res = arguments[0];
        let resT = typeof res === 'undefined';
        let hasStatus = res.hasOwnProperty('status');
        let statusT = typeof res.status === 'undefined';
        let hasAction = res.hasOwnProperty('action');
        let actionT = typeof res.action === 'undefined';

        if (resT || !hasStatus || statusT || !hasAction || actionT) {
            return [Const.UNEXPECTED_ERR_MSG, Const.UNEXPECTED_ERR];
        }
        return f.call(this, ...arguments);
    };
}

function concat(action, text) {
    return `${action} ${text}`;
}

function buildCreatePlanResMsg(res) {
    if (res.status !== 'success') {
        let action = "";
        let text = "";

        if (res.action === Const.ACTON_CREATE_PLAN) {
            action = Const.FAILED_TO_CREATE_PLAN_MSG;
        } else {
            return [Const.UNEXPECTED_ERR_MSG, Const.UNEXPECTED_ERR];
        }

        switch (res.text) {
            case Const.PLAN_NAME_EXISTS_ERR:
                text = Const.PLAN_NAME_EXISTS_MSG;
                break;
            case Const.INVALID_PLAN_NAME_ERR:
                text = Const.INVALID_PLAN_NAME_MSG;
                break;
            case Const.UNEXPECTED_DB_ERR:
                text = Const.UNEXPECTED_DB_ERR_MSG;
                break;
            case Const.PLAN_NAME_NOT_EXISTS_ERR:
            default:
                return [Const.UNEXPECTED_ERR_MSG, Const.UNEXPECTED_ERR_MSG];
        }

        return [concat(action, text), text];
    }
    return ["", Const.SUCCESS];
}

function buildRenamePlanResMsg(res) {
    if (res.status !== 'success') {
        let action = "";
        let text = "";

        if (res.action === Const.ACTON_RENAME_PLAN) {
            action = Const.FAILED_TO_RENAME_PLAN_MSG;
        } else {
            return [Const.UNEXPECTED_ERR_MSG, Const.UNEXPECTED_ERR];
        }

        switch (res.text) {
            case Const.RENAME_PLAN_NAME_EXISTS_ERR:
                text = Const.PLAN_NAME_EXISTS_MSG;
                break;
            case Const.INVALID_RENAME_PLAN_NAME_ERR:
                text = Const.INVALID_PLAN_NAME_MSG;
                break;
            case Const.UNEXPECTED_DB_ERR:
                text = Const.UNEXPECTED_DB_ERR_MSG;
                break;
            case Const.PLAN_NAME_NOT_EXISTS_ERR:
            default:
                return [Const.UNEXPECTED_ERR_MSG, Const.UNEXPECTED_ERR];
        }

        return [concat(action, text), text];
    }
    return ["", Const.SUCCESS];
};

function buildGetPlanNamesResMsg(res) {
    let hasNames = res.hasOwnProperty('names');
    let namesT = typeof res.names === 'undefined';

    if (res.status !== 'success' || !hasNames || namesT) {
        let action = "";
        let text = "";

        if (res.action === Const.ACTON_GET_PLAN_NAMES) {
            action = Const.FAILED_TO_GET_PLAN_NAMES_MSG;
        } else {
            return [Const.UNEXPECTED_ERR_MSG, Const.UNEXPECTED_ERR];
        }

        if (res.text === Const.UNEXPECTED_DB_ERR) {
            text = Const.UNEXPECTED_DB_ERR_MSG;
        } else {
            return [Const.UNEXPECTED_ERR_MSG, Const.UNEXPECTED_ERR];
        }

        return [concat(action, text), text];
    }

    if (res.names.length === 0) {
        return [Const.PLAN_LIST_EMPTY_MSG, Const.PLAN_LIST_EMPTY_INFO];
    }
    return ["", Const.SUCCESS];
}

function buildOpenPlanResMsg(res) {
    let hasPlan = res.hasOwnProperty('plan');
    let planT = typeof res.names === 'undefined';

    if (res.status !== 'success' || !hasPlan || !planT) {
        let action = "";
        let text = "";

        if (res.action === Const.ACTON_OPEN_PLAN) {
            action = Const.FAILED_TO_OPEN_PLAN_MSG;
        } else {
            return [Const.UNEXPECTED_ERR_MSG, Const.UNEXPECTED_ERR];
        }

        switch (res.text) {
            case Const.UNEXPECTED_DB_ERR:
                text = Const.UNEXPECTED_DB_ERR_MSG;
                break;
            case Const.PLAN_NAME_NOT_EXISTS_ERR:
            default:
                return [Const.UNEXPECTED_ERR_MSG, Const.UNEXPECTED_ERR];
        }

        return [concat(action, text), text];
    }
    return ["", Const.SUCCESS];
}

function buildDeletePlanResMsg(res) {
    if (res.status !== 'success') {
        let action = "";
        let text = "";

        if (res.action === Const.ACTON_DELETE_PLAN) {
            action = Const.FAILED_TO_DELETE_PLAN_MSG;
        } else {
            return [Const.UNEXPECTED_ERR_MSG, Const.UNEXPECTED_ERR];
        }

        switch (res.text) {
            case Const.UNEXPECTED_DB_ERR:
                text = Const.UNEXPECTED_DB_ERR_MSG;
                break;
            case Const.PLAN_NAME_NOT_EXISTS_ERR:
            case Const.INVALID_PLAN_NAME_ERR:
            default:
                return [Const.UNEXPECTED_ERR_MSG, Const.UNEXPECTED_ERR_MSG];
        }

        return [concat(action, text), text];
    }
    return ["", Const.SUCCESS];
}

function buildUpdatePlanResMsg(res) {
    if (res.status !== 'success') {
        let action = "";
        let text = "";

        if (res.action === Const.ACTON_UPDATE_PLAN) {
            action = Const.FAILED_TO_UPDATE_PLAN_MSG;
        } else {
            return [Const.UNEXPECTED_ERR_MSG, Const.UNEXPECTED_ERR];
        }

        switch (res.text) {
            case Const.UNEXPECTED_DB_ERR:
                text = Const.UNEXPECTED_DB_ERR_MSG;
                break;
            case Const.PLAN_NAME_NOT_EXISTS_ERR:
            case Const.INVALID_PLAN_NAME_ERR:
            default:
                return [Const.UNEXPECTED_ERR_MSG, Const.UNEXPECTED_ERR_MSG];
        }

        return [concat(action, text), text];
    }
    return ["", Const.SUCCESS];
}
buildCreatePlanResMsg = buildUnexpectedErrMsg(buildCreatePlanResMsg);
buildRenamePlanResMsg = buildUnexpectedErrMsg(buildRenamePlanResMsg);
buildGetPlanNamesResMsg = buildUnexpectedErrMsg(buildGetPlanNamesResMsg);
buildOpenPlanResMsg = buildUnexpectedErrMsg(buildOpenPlanResMsg);
buildDeletePlanResMsg = buildUnexpectedErrMsg(buildDeletePlanResMsg);
buildUpdatePlanResMsg = buildUnexpectedErrMsg(buildUpdatePlanResMsg);

export {
    buildCreatePlanResMsg,
    buildRenamePlanResMsg,
    buildGetPlanNamesResMsg,
    buildOpenPlanResMsg,
    buildDeletePlanResMsg,
    buildUpdatePlanResMsg
}