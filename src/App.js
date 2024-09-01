import { useState } from "react";
import "./App.css";
import styled from "styled-components";

const ErrorMessage = styled.p`
  color: red;
  margin-top: 8px;
  margin-bottom: 8px;
`;
const ServerErrorMessage = styled.p`
  margin-left: 10px;
  margin-right: 10px;
  color: red;
  margin-top: 8px;
  margin-bottom: 8px;
`;
const Label = styled.label`
  font-weight: bold;
  margin-top: 10px;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
`;
const Button = styled.button`
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  border: 1px solid;
  color: #fff;
  cursor: pointer;
  border-radius: 8px 8px 8px 8px;

  &:hover {
    border: 1px solid #a4a7aa;
  }
`;
const Input = styled.input`
  padding: 5px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  resize: none;

  &:hover {
    border: 1px solid #95d5e2 !important;
  }
`;
const Textarea = styled.textarea`
  padding: 5px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;

  &:hover {
    border: 1px solid #95d5e2 !important;
  }
`;

let serverRes = {
  name: true,
  email: true,
  topic: true,
  captcha: true,
  message: true,
  phone: true,
  check: true,
};

function App() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState("");
  const [check, setCheck] = useState(false);
  const [checkboxError, setCheckboxError] = useState(false);
  const [nameCheck, setNameCheck] = useState(true);
  const [phoneCheck, setPhoneCheck] = useState(true);
  const [emailCheck, setEmailCheck] = useState(true);
  const [messageCheck, setMessageCheck] = useState(true);
  const [topicCheck, setTopicCheck] = useState(true);
  const [serverResponse, setServerResponse] = useState(serverRes);
  const [captcha, setCaptcha] = useState("");

  let nameInputBorderColor = nameCheck ? "#ccc" : "red";
  let nameLabelColor = nameCheck ? "black" : "red";
  let phoneLabelColor = phoneCheck ? "black" : "red";
  let phoneInputBorderColor = phoneCheck ? "#ccc" : "red";
  let emailLabelColor = emailCheck ? "black" : "red";
  let emailInputBorderColor = emailCheck ? "#ccc" : "red";
  let messageLabelColor = messageCheck ? "black" : "red";
  let messageInputBorderColor = messageCheck ? "#ccc" : "red";
  let topicLabelColor = topicCheck ? "black" : "red";

  function handleNameChange(e) {
    setName(e.target.value);
  }
  function handlePhoneChange(e) {
    setPhone(e.target.value);
  }
  function handleEmailChange(e) {
    setEmail(e.target.value);
  }
  function handleTopicChange(e) {
    setTopic(e.target.value);
  }
  function handleMessageChange(e) {
    setMessage(e.target.value);
  }
  function handleCheckChange(e) {
    if (check) {
      setCheck(false);
    } else {
      setCheck(true);
    }
  }
  function handleCaptchaChange(e) {
    setCaptcha(e.target.value);
  }

  function validation() {
    let counter = 0;
    if (!check) {
      setCheckboxError(true);
    } else {
      setCheckboxError(false);
      counter++;
    }

    if (name.length === 0 || name.length > 255) {
      setNameCheck(false);
    } else {
      setNameCheck(true);
      counter++;
    }

    if (phone.length === 11) {
      if (
        phone.match(
          /(^8|7|\+7)((\d{10})|(\s\(\d{3}\)\s\d{3}\s\d{2}\s\d{2}))/
        ) !== null
      ) {
        setPhoneCheck(true);
        counter++;
      }
    } else {
      setPhoneCheck(false);
    }

    if (email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) !== null) {
      setEmailCheck(true);
      counter++;
    } else {
      setEmailCheck(false);
    }

    if (message.length < 4096 && message.length !== 0) {
      setMessageCheck(true);
      counter++;
    } else {
      setMessageCheck(false);
    }

    if (topic !== "") {
      setTopicCheck(true);
      counter++;
    } else {
      setTopicCheck(false);
    }

    if (counter === 6) {
      return true;
    }
    return false;
  }

  function handleSubmit(e) {
    e.preventDefault();
    let censorCaptcha = document.cookie.split(";");
    censorCaptcha = censorCaptcha[0].substring(8);
    let resultValidation = validation();

    if (resultValidation) {
      let formdata = {
        name: name,
        phone: phone,
        email: email,
        message: message,
        topic: topic,
        check: check,
        captcha: captcha,
        censorCaptcha: censorCaptcha,
      };
      try {
        let promise = fetch("http://localhost:8000/server.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(formdata),
        });

        promise
          .then((response) =>
            response.ok ? response : Promise.reject(response)
          )
          .then((response) => response.json())
          .then((json) => {
            setServerResponse(json);
            if (json.all === true) {
              alert("Форма успешно заполнена и отправлена");
            }
          })
          .catch((err) => {
            return alert(
              "Произошла ошибка! Возможно вы неправильно ввели данные."
            );
          });
      } catch (e) {
        alert("Произошла ошибка, попробуйте еще раз");
      }
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "600px",
          borderRadius: "25px",
          border: "1px solid #ccc",
          flexDirection: "column",
        }}
      >
        <h1
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: 0,
            padding: "10px 0px 10px 0px",
            background: "#ccc",
            borderRadius: "25px 25px 0px 0px",
          }}
        >
          Форма обратной связи
        </h1>
        <Form id="feedbackForm" onSubmit={handleSubmit}>
          <Label style={{ color: topicLabelColor }}>Тема обращения:</Label>
          <select name="topic" id="topic-select" onChange={handleTopicChange}>
            <option value="">--Пожалуйста, выберите тему--</option>
            <option value="topic1">Тема1</option>
            <option value="topic2">Тема2</option>
            <option value="topic3">Тема3</option>
          </select>
          {!topicCheck ? (
            <ErrorMessage>
              Пожалуйста, укажите тему вашего обращения.
            </ErrorMessage>
          ) : (
            <></>
          )}
          <Label style={{ color: nameLabelColor }}>Ф.И.О.</Label>
          <Input
            type="text"
            id="name"
            name="name"
            style={{ borderColor: nameInputBorderColor }}
            value={name}
            onChange={handleNameChange}
          />
          {!nameCheck ? (
            <ErrorMessage>
              Поле должно быть заполнено и длина имени не должна превышать 255
              символов
            </ErrorMessage>
          ) : (
            <></>
          )}
          <Label style={{ color: phoneLabelColor }}>Телефон:</Label>
          <Input
            type="text"
            id="number"
            name="number"
            style={{ borderColor: phoneInputBorderColor }}
            onChange={handlePhoneChange}
          />
          {!phoneCheck ? (
            <ErrorMessage>
              Поле не заполнено, либо данные введены неверно.
            </ErrorMessage>
          ) : (
            <></>
          )}
          <Label style={{ color: emailLabelColor }}>Email:</Label>
          <Input
            type="email"
            id="email"
            name="email"
            style={{ borderColor: emailInputBorderColor }}
            onChange={handleEmailChange}
          />
          {!emailCheck ? (
            <ErrorMessage>
              Поле не заполнено, либо данные введены неверно.
            </ErrorMessage>
          ) : (
            <></>
          )}
          <Label style={{ color: messageLabelColor }}>Сообщение:</Label>
          <Textarea
            id="message"
            name="message"
            onChange={handleMessageChange}
            style={{ borderColor: messageInputBorderColor }}
          />
          {!messageCheck ? (
            <ErrorMessage>
              Поле должно быть заполнено и длина сообщения не должна превышать
              4096 символов
            </ErrorMessage>
          ) : (
            <></>
          )}
          <div style={{ marginBottom: 10, marginTop: 10 }}>
            <Input
              type="checkbox"
              id="checkbox"
              name="checkbox"
              style={{ margin: "5px 5px 5px 0px" }}
              onChange={handleCheckChange}
            />
            <Label style={{ margin: 0 }}>
              Согласие на обработку персональных данных
            </Label>
          </div>
          {checkboxError ? (
            <ErrorMessage>Пожалуйста, подтвердите согласие</ErrorMessage>
          ) : (
            <></>
          )}
          <div>
            <img
              src="http://localhost:8000/captcha.php"
              width="132"
              alt="captcha"
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label>Код, изображенный на картинке</label>
              <Input
                style={{ maxWidth: 200, marginBottom: 10 }}
                type="text"
                name="captcha"
                id="captcha"
                onChange={handleCaptchaChange}
              />
              {!serverResponse.captcha ? (
                <ErrorMessage>
                  Пожалуйста, введите значения с картинки корректно
                </ErrorMessage>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button type="submit">Отправить</Button>
          </div>
        </Form>
      </div>
      <div
        style={{
          marginLeft: 10,
          border: "1px solid #ccc",
          borderRadius: "25px",
        }}
      >
        {!serverResponse.topic ||
        !serverResponse.name ||
        !serverResponse.phone ||
        !serverResponse.email ||
        !serverResponse.message ||
        !serverResponse.check ||
        !serverResponse.captcha ? (
          <h1
            style={{
              margin: 0,
              padding: 10,
              background: "#ccc",
              borderRadius: "25px 25px 0px 0px",
            }}
          >
            Ошибка заполнения формы
          </h1>
        ) : (
          <></>
        )}

        {!serverResponse.topic ? (
          <ServerErrorMessage>Тема обращения не выбрана</ServerErrorMessage>
        ) : (
          <></>
        )}
        {!serverResponse.name ? (
          <ServerErrorMessage>
            Поле Ф.И.О. заполнено неправильно
          </ServerErrorMessage>
        ) : (
          <></>
        )}
        {!serverResponse.phone ? (
          <ServerErrorMessage>
            Поле телефон заполнено неправильно
          </ServerErrorMessage>
        ) : (
          <></>
        )}
        {!serverResponse.email ? (
          <ServerErrorMessage>
            Поле email заполнено неправильно
          </ServerErrorMessage>
        ) : (
          <></>
        )}
        {!serverResponse.message ? (
          <ServerErrorMessage>
            Поле сообщения заполнено неправильно
          </ServerErrorMessage>
        ) : (
          <></>
        )}
        {!serverResponse.check ? (
          <ServerErrorMessage>
            Согласие на обработку персональных данных не подтверждено
          </ServerErrorMessage>
        ) : (
          <></>
        )}
        {!serverResponse.captcha ? (
          <ServerErrorMessage>Captcha заполнена неправильно</ServerErrorMessage>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default App;
