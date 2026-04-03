import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WithdrawalLimit {
    lastResetTimestamp: bigint;
    todayWithdrawn: bigint;
    limitPerTransaction: bigint;
    limitPerDay: bigint;
}
export interface UserAccount {
    notificationPreferences: {
        coinChime: boolean;
        alertStyle: Variant_top_center;
    };
    twoFactorEnabled: boolean;
    owner: Principal;
    type: Variant_personal_business_royal;
    displayPreferences: {
        frameSize: bigint;
        darkIntensity: bigint;
        immersive: boolean;
    };
    withdrawalLimit: WithdrawalLimit;
}
export interface UserProfile {
    nickname: string;
    linkedAccounts: Array<string>;
    accountType: Variant_personal_business_royal;
    avatarConfig: {
        color: string;
        crown: string;
        clothes: string;
    };
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_personal_business_royal {
    personal = "personal",
    business = "business",
    royal = "royal"
}
export enum Variant_top_center {
    top = "top",
    center = "center"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAccount(user: Principal): Promise<UserAccount | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWithdrawalLimit(user: Principal): Promise<WithdrawalLimit | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllAccounts(): Promise<Array<UserAccount>>;
    saveAccount(account: UserAccount): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
