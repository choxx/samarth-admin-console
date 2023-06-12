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
    // const originalSetItem = localStorage.setItem;

    // Setting the userData in storage before modifying function calls.
    localStorage.setItem(
      "userData",
      JSON.stringify(response?.data?.result?.data)
    );
    const event: any = new Event('userFetched');

    event.value = response?.data?.result?.data?.user?.token;
    event.key = 'jwtToken';

    document.dispatchEvent(event);
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

export const RefreshToken = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem("userData") as string);
    const data = {
      token: userData?.user?.token,
      refreshToken: userData?.user?.refreshToken
    }
    if (data.token && data.refreshToken) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/refresh-token`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          "x-application-id": '77638847-db34-4331-b369-5768fdfededd'
        },
        body: JSON.stringify(data)
      });
      if (res) {
        let refreshData = await res.json();
        userData.user.token = refreshData.result.user.token;
        userData.user.refreshToken = refreshData.result.user.refreshToken;

        const event: any = new Event('refreshUserToken');

        event.value = refreshData.result.user.token;
        event.key = 'jwtToken';

        document.dispatchEvent(event);

        localStorage.setItem('userData', JSON.stringify(userData));
      }
    }
  } catch (error) {
    return false;
  }
};
