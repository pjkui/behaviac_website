/**
 * Created by quinnpan on 2016/1/21.
 */
var behaviac = {
    VERSION: "0.0.1",
    AUTHOR: "Jonli@tencent.com;cainhuang@tencent.com;QuinnPan@tencent.com",
    Licence: "MIT"
};
behaviac.waitSequence = [];
behaviac.checkWaitSequence = function (id) {
    if (behaviac.waitSequence.indexOf(id) > -1) {
        return true;
    }
    else {
        return false;
    }
}
behaviac.waitSequence.remove = function (id) {
    var pos = behaviac.waitSequence.indexOf(id);
    if (pos > -1) {
        behaviac.waitSequence.splice(pos, 1);
    }
}