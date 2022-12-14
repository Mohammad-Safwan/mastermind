import {
  LOGIN_SUCCESS,
  GET_APP_STATE,
  LOGIN_FAILED,
  START_QUIZ,
  USER_RESULT,
  USER_RESULT_FAILED,
  SHOW_ANSWER,
  LOGOUT,
} from "../constants/action-types";
import firebase from "firebase";

export const getUserData = value => {
  return dispatch => {
    firebase
      .database()
      .ref("users")
      .orderByChild("id")
      .equalTo(value)
      .once("value")
      .then(snapshot => {
        if (snapshot.exists()) {
          snapshot.forEach(function (data) {
            console.log(data.child("login").val(), "Error: passed snapsot");

            if (
              data.child("login").val() &&
              !localStorage.getItem("id") &&
              data
                .child("role")
                .val()
                .toLowerCase() == "user"
            ) {
              console.log("Error: already login failed");
              dispatch({
                type: LOGIN_FAILED,
                payload: "User is already login to another device"
              });
            } else {
              console.log("login sucess", data.val());
              data.ref.child("login").set(true);
              localStorage.setItem("id", data.child("id").val());
              dispatch({ type: LOGIN_SUCCESS, payload: data.val() });
            }
          });
        } else {
          console.log("Error: failed");
          dispatch({ type: LOGIN_FAILED, payload: "Invalid User key" });
        }
      });
  };
};

export const getAppState = () => {
  return dispatch => {
    firebase
      .database()
      .ref("appState")
      .on("value", snapshot => {
        if (snapshot.exists()) {
          snapshot.forEach(function (data) {
            console.log(data.val(), "awssssawssssawssss");
            dispatch({ type: GET_APP_STATE, payload: data.val() });
          });
        } else {
          console.log("asdasxzczxc show toast invalid ID");
        }
      });
  };
};

export const getLoginState = () => {
  return dispatch => {
    firebase
      .database()
      .ref("loginState")
      .on("value", snapshot => {
        if (snapshot.exists()) {
          snapshot.forEach(function (data) {
            const dataValue = data.val();
            if (dataValue.state) {
              dispatch({ type: START_QUIZ, payload: "" });
            }
          });
        } else {
          console.log("abcdasad");
        }
      });
  };
};

export const startQuiz = () => {
  console.log(START_QUIZ, "START_QUIZSTART_QUIZ");
  return dispatch => {
    firebase
      .database()
      .ref("loginState")
      .orderByChild("state")
      .once("value", snapshot => {
        snapshot.forEach(function (data) {
          data.ref.child("state").set(true);
        });
      });
  };
};

export const getUserResult = value => {
  return dispatch => {
    firebase
      .database()
      .ref("userResults")
      .orderByChild("id")
      .equalTo(value)
      .on("value", snapshot => {
        if (snapshot.exists()) {
          console.log("Error: passed");
          snapshot.forEach(function (data) {
            console.log(data.val(), "user ersuultss");
            dispatch({ type: USER_RESULT, payload: data.val() });
          });
        } else {
          console.log("Error: failed");
          dispatch({ type: USER_RESULT_FAILED, payload: "" });
        }
      });
  };
};

export const storeAnswer = (obj, value) => {
  console.log(obj, "poo", value);
  return dispatch => {
    firebase
      .database()
      .ref("userResults")
      .orderByChild("id")
      .equalTo(value)
      .once("value")
      .then(snapshot => {
        if (snapshot.exists()) {
          console.log("Error: passed");
          snapshot.forEach(function (data) {
            console.log("Error: passed", data.val());
            if (obj.score && obj.totalCorrectAnswers) {
              data.ref.child("score").set(obj.score);
              data.ref.child("totalCorrectAnswers").set(obj.totalCorrectAnswers);
              data.ref.child("rank").set(obj.rank);
            } else {
              data.ref.child("rank").set(obj.rank);
            }
          });
        } else {
          console.log("Error: failed");
          dispatch({ type: USER_RESULT_FAILED, payload: "" });
        }
      });
  };
};

export const configureUserResults = (obj, value) => {
  console.log(obj, "poo", value);
  return dispatch => {
    firebase
      .database()
      .ref("userResults")
      .orderByChild("id")
      .equalTo(value)
      .once("value")
      .then(snapshot => {
        if (snapshot.exists()) {
          console.log("Error: passed");
          snapshot.forEach(function (data) {
            console.log("Error: passed", data.val());
            data.ref.child("score").set(obj.score);
            data.ref.child("totalCorrectAnswers").set(obj.totalCorrectAnswers);
            data.ref.child("rank").set(obj.rank);
          });
        } else {
          console.log("Error: failed");
        }
      });
  };
};

export const configureUser = (value) => {
  return dispatch => {
    firebase
      .database()
      .ref("users")
      .orderByChild("id")
      .equalTo(value)
      .once("value")
      .then(snapshot => {
        if (snapshot.exists()) {
          console.log("Error: passed");
          snapshot.forEach(function (data) {
            console.log("Error: passed", data.val());
            data.ref.child("login").set(false);
          });
        } else {
          console.log("Error: failed");
          dispatch({ type: USER_RESULT_FAILED, payload: "" });
        }
      });
  };
};

export const configureAppState = () => {
  return dispatch => {
    firebase
      .database()
      .ref("appState")
      .once("value")
      .then(snapshot => {
        if (snapshot.exists()) {
          console.log("Error: passed");
          snapshot.forEach(function (data) {
            console.log("Error: passed", data.val());
            data.ref.child("questionStatus").set(true);
            data.ref.child("showResult").set(false);
            data.ref.child("state").set(0);
          });
        } else {
          console.log("Error: failed");
          dispatch({ type: USER_RESULT_FAILED, payload: "" });
        }
      });
  };
};

export const changeLoginState = () => {
  console.log(START_QUIZ, "START_QUIZSTART_QUIZ");
  return dispatch => {
    firebase
      .database()
      .ref("loginState")
      .orderByChild("state")
      .once("value", snapshot => {
        snapshot.forEach(function (data) {
          data.ref.child("state").set(false);
        });
      });
  };
};

export const getShowAnswerState = () => {
  return dispatch => {
    firebase
      .database()
      .ref("answerState")
      .on("value", snapshot => {
        if (snapshot.exists()) {
          snapshot.forEach(function (data) {
            console.log(data.val(), "awssssawssssawssss");
            dispatch({ type: SHOW_ANSWER, payload: data.val() });
          });
        }
      });
  };
};

export const userLogout = (id) => {
  console.log('asdasd',id)
  return dispatch => {
    firebase
      .database()
      .ref("users")
      .orderByChild("id")
      .equalTo(id)
      .once("value")
      .then(snapshot => {
        if (snapshot.exists()) {
          snapshot.forEach(function (data) {
            console.log(data.child("login").val(), "Error: passed snapsot");
            data.ref.child("login").set(false);
            dispatch({ type: LOGOUT, payload: '' });
            localStorage.clear();
          });
        }
      }); 
  }
  /* return dispatch => {
    firebase
      .database()
      .ref("users")
      .orderByChild("id")
      .equalTo(id)
      .once("value")
      .then(snapshot => {
        if (snapshot.exists()) {
          snapshot.forEach(function (data) {
            console.log(data.child("login").val(), "Error: passed snapsot");
            data.ref.child("login").set(false);
            dispatch({ type: LOGOUT, payload: '' });
            localStorage.clear();
            
          });
        }
      });
  }; */
}