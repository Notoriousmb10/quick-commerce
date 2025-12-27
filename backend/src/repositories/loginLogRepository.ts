import LoginLog, { ILoginLog } from "../models/Login";

const create = async (logData: Partial<ILoginLog>): Promise<ILoginLog> => {
  return await LoginLog.create(logData);
};

export default {
  create,
};
