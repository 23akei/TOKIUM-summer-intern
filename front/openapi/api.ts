/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** ユーザー作成 */
export interface CreateUser {
  name?: string;
  role?: string;
}

/** ユーザー */
export interface User {
  id?: number;
  name?: string;
  role?: string;
}

/** 経費申請 */
export interface Application {
  title?: string;
  date?: string;
  description?: string;
  user_id?: number;
  kind?: string;
  shop?: string;
  amount?: number;
  approval_state?: string;
  flow_id?: number;
}

/** 経費申請作成 */
export interface CreateApplication {
  title?: string;
  date?: string;
  description?: string;
  user_id?: number;
  kind?: string;
  shop?: string;
  amount?: number;
  flow_id?: number;
}

/** 承認フロー */
export interface Flow {
  flow?: (Condition | Approvers)[];
}

/** 承認フローの条件 */
export interface Condition {
  key?: string;
  value?: string;
  Condition?: string;
}

/** 承認フローごとの承認者のリスト */
export interface Approvers {
  approvers?: User[];
}

/** 申請状態 */
export interface Approval {
  /** 申請ID */
  application_id?: number;
  /** 承認者のユーザーID */
  user_id?: number;
  /** 承認状態（approved, rejected） */
  status?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://localhost:3000/api/v1";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Keihi Seisan API
 * @version 1.0.0
 * @baseUrl http://localhost:3000/api/v1
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  users = {
    /**
     * No description
     *
     * @tags Users
     * @name CreateUser
     * @summary Create a new user
     * @request POST:/users
     */
    createUser: (data: CreateUser, params: RequestParams = {}) =>
      this.request<
        User,
        {
          message?: string;
        }
      >({
        path: `/users`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name GetUsers
     * @summary Get all users
     * @request GET:/users
     */
    getUsers: (params: RequestParams = {}) =>
      this.request<
        User[],
        {
          message?: string;
        }
      >({
        path: `/users`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name GetUsersByRole
     * @summary Get all users by role
     * @request GET:/users/role/{role}
     */
    getUsersByRole: (role: string, params: RequestParams = {}) =>
      this.request<
        User[],
        {
          message?: string;
        }
      >({
        path: `/users/role/${role}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name GetUserById
     * @summary Get a user by ID
     * @request GET:/users/{userId}
     */
    getUserById: (userId: number, params: RequestParams = {}) =>
      this.request<
        User,
        {
          message?: string;
        }
      >({
        path: `/users/${userId}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  application = {
    /**
     * No description
     *
     * @tags Applications
     * @name CreateApplication
     * @summary Create a new application
     * @request POST:/application
     */
    createApplication: (data: CreateApplication, params: RequestParams = {}) =>
      this.request<
        Application,
        {
          message?: string;
        }
      >({
        path: `/application`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Applications
     * @name GetApplications
     * @summary Get all applications
     * @request GET:/application
     */
    getApplications: (params: RequestParams = {}) =>
      this.request<
        Application[],
        {
          message?: string;
        }
      >({
        path: `/application`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Applications
     * @name GetApplicationById
     * @summary Get an application by ID
     * @request GET:/application/{applicationId}
     */
    getApplicationById: (applicationId: number, params: RequestParams = {}) =>
      this.request<
        Application,
        {
          message?: string;
        }
      >({
        path: `/application/${applicationId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Applications
     * @name GetApplicationsByUserId
     * @summary Get all applications by user ID
     * @request GET:/application/user/{userId}
     */
    getApplicationsByUserId: (userId: number, params: RequestParams = {}) =>
      this.request<
        Application[],
        {
          message?: string;
        }
      >({
        path: `/application/user/${userId}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  flows = {
    /**
     * No description
     *
     * @tags Flows
     * @name GetFlows
     * @summary Get all flows
     * @request GET:/flows
     */
    getFlows: (params: RequestParams = {}) =>
      this.request<
        Flow[],
        {
          message?: string;
        }
      >({
        path: `/flows`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Flows
     * @name CreateFlow
     * @summary Create a new flow
     * @request POST:/flows
     */
    createFlow: (data: Flow, params: RequestParams = {}) =>
      this.request<
        {
          id?: number;
        },
        {
          message?: string;
        }
      >({
        path: `/flows`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Flows
     * @name GetFlowById
     * @summary Get a flow by ID
     * @request GET:/flows/{flowId}
     */
    getFlowById: (flowId: number, params: RequestParams = {}) =>
      this.request<
        Flow,
        {
          message?: string;
        }
      >({
        path: `/flows/${flowId}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  approvals = {
    /**
     * No description
     *
     * @tags Approvals
     * @name CreateApproval
     * @summary Create a new approval
     * @request POST:/approvals
     */
    createApproval: (data: Approval, params: RequestParams = {}) =>
      this.request<
        {
          id?: number;
        },
        {
          message?: string;
        }
      >({
        path: `/approvals`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Approvals
     * @name GetApprovalsByUserId
     * @summary 自身に承認の要求が来ている申請を取得
     * @request GET:/approvals/{userId}
     */
    getApprovalsByUserId: (userId: number, params: RequestParams = {}) =>
      this.request<
        Approval[],
        {
          message?: string;
        }
      >({
        path: `/approvals/${userId}`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
