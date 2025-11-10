export type Tokens = {
    accessToken: string;
    refreshToken: string;
  };

  export interface JwtPayload {
    sub: string;
  }