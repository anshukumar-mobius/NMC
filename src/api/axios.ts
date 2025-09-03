import axios, { AxiosResponse, } from "axios";

interface UserData {
  telephoneNum: string;
  emailId: string;
  userName: string;
  firstName: string;
  lastName: string;
  name: string;
  mockTest: any;
  password: string;
}

const Vite_Token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI3Ny1NUVdFRTNHZE5adGlsWU5IYmpsa2dVSkpaWUJWVmN1UmFZdHl5ejFjIn0.eyJleHAiOjE3MjYxODIzMzEsImlhdCI6MTcyNjE0NjMzMSwianRpIjoiOGVlZTU1MDctNGVlOC00NjE1LTg3OWUtNTVkMjViMjQ2MGFmIiwiaXNzIjoiaHR0cDovL2tleWNsb2FrLmtleWNsb2FrLnN2Yy5jbHVzdGVyLmxvY2FsOjgwODAvcmVhbG1zL21hc3RlciIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJmNzFmMzU5My1hNjdhLTQwYmMtYTExYS05YTQ0NjY4YjQxMGQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJIT0xBQ1JBQ1kiLCJzZXNzaW9uX3N0YXRlIjoiYmI1ZjJkMzktYTQ3ZC00MjI0LWFjZGMtZTdmNzQwNDc2OTgwIiwibmFtZSI6ImtzYW14cCBrc2FteHAiLCJnaXZlbl9uYW1lIjoia3NhbXhwIiwiZmFtaWx5X25hbWUiOiJrc2FteHAiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJwYXNzd29yZF90ZW5hbnRfa3NhbXhwQG1vYml1c2R0YWFzLmFpIiwiZW1haWwiOiJwYXNzd29yZF90ZW5hbnRfa3NhbXhwQG1vYml1c2R0YWFzLmFpIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiLyoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtbWFzdGVyIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7IkhPTEFDUkFDWSI6eyJyb2xlcyI6WyJIT0xBQ1JBQ1lfVVNFUiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwic2lkIjoiYmI1ZjJkMzktYTQ3ZC00MjI0LWFjZGMtZTdmNzQwNDc2OTgwIiwidGVuYW50SWQiOiJmNzFmMzU5My1hNjdhLTQwYmMtYTExYS05YTQ0NjY4YjQxMGQiLCJyZXF1ZXN0ZXJUeXBlIjoiVEVOQU5UIn0=.FXeDyHBhlG9L4_NCeSyHEaNEBVmhFpfSBqlcbhHaPaoydhKcA0BfuyHgxg_32kQk6z5S9IQ7nVKS2ybtOvwo0WyLWwLQchSq7Noa7LooHIMzmeWMQb_bLKtbaOti59zwIdS8CkfGaXut7RUQKISQVWmbUGsVJQa2JkG6Ng_QN0y5hFVksMWPZiXVsofQkJXHXV1CQ3gabhhHKo3BqlJwzpsCKLDfg1-4PmSl1Wqbw03Ef2yolroj5i8FoeHukOQPkwCUHrrNw-ilIp917nqZa89YbCMtDjWyaj8pEH7GJR5vMZPE2WcJPn5dSA1IHVunfatEB1cDAitaFjVNWNnddQ";

const instance = axios.create({
  baseURL: "https://ig.gov-cloud.ai",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Vite_Token || localStorage.getItem("token")}`,
  },
});

// Add request interceptor to update token
// instance.interceptors.request.use((config) => {
//   const token = import.meta.env.VITE_TOKEN || localStorage.getItem("token");
//   if (token) {
//     config.headers = config.headers || {};
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

const getAdhoc = async (query:string): Promise<any> => {
  const bodyData ={
    "type": "TIDB",
    "definition": query
  };
  const response: AxiosResponse = await instance.post(`/pi-cohorts-service-dbaas/v1.0/cohorts/adhoc`, bodyData);
  return response.data;
}

const getInstance = async (schemaId: string, filter: any): Promise<any> => {
  const bodyData = {
    dbType: "TIDB",
    filter: filter || {},
  };
  const response: AxiosResponse = await instance.post(
    `/pi-entity-instances-service/v2.0/schemas/${schemaId}/instances/list?size=1000`,
    bodyData
  );
  return response.data;
};

const addInstance = async ({ schemaId, data }: { schemaId: string; data: any }): Promise<any> => {
  const bodyData = {
    data: [data],
  };
  const response: AxiosResponse = await instance.post(`/pi-entity-instances-service/v2.0/schemas/${schemaId}/instances`, bodyData);
  return response.data;
};

const getJoinInstance = async (schemaId: string): Promise<any> => {
  const bodyData = {
    dbType: "TIDB"
  };
  const response: AxiosResponse = await instance.post(
    `/pi-entity-instances-service/v2.0/schemas/${schemaId}/instances/list?showDBaaSReservedKeywords=true&showReferencedData=true&showPageableMetaData=true&size=3000`,
    bodyData
  );
  return response.data;
};


export { getInstance, addInstance, getAdhoc, getJoinInstance };
