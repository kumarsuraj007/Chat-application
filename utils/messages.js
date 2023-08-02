import moment from "moment";

function formatMessages (username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}

export default formatMessages;