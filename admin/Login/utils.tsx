import { client } from "../api-clients/users-client";

const AuthApplicationID = "77638847-db34-4331-b369-5768fdfededd";

export const getToken = async (userName: string, password: string) => {
  const body: any = {
    password: `${password}`,
    loginId: `${userName}`,
    applicationId: AuthApplicationID,
  };
  const response = await client.post("/user/login", body);
  if (response?.data?.result?.data) {

    // Storing orinal setItem prototype.
    const originalSetItem = localStorage.setItem;

    // Setting the userData in storage before modifying function calls.
    localStorage.setItem(
      "userData",
      JSON.stringify(response?.data?.result?.data)
    );

    // Creating a custom event based method to override setItem.
    localStorage.setItem = function (key, value) {
      const event: any = new Event('userFetched');

      event.value = value;
      event.key = key;

      document.dispatchEvent(event);
      originalSetItem.apply(this, [key, value]);
    };

    // Setting token to be used in prepareDataProviders
    localStorage.setItem(
      "jwtToken",
      response?.data?.result?.data?.user?.token
    );
  }
  return response;
};

export const loginPreCheck = async (userName: string, password: string) => {
  const body: any = {
    password: `${password}`,
    loginId: `${userName}`,
    applicationId: AuthApplicationID,
  };
  const response = await client.post("/user/login", body);

  if (response?.data.responseCode === "OK") return true;
  return false;
};
