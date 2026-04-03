import Iter "mo:core/Iter";
import Map "mo:core/Map";
import MixinStorage "blob-storage/Mixin";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type WithdrawalLimit = {
    limitPerDay : Nat;
    limitPerTransaction : Nat;
    todayWithdrawn : Nat;
    lastResetTimestamp : Int;
  };

  public type UserAccount = {
    owner : Principal;
    type_ : {
      #personal;
      #business;
      #royal;
    };
    withdrawalLimit : WithdrawalLimit;
    twoFactorEnabled : Bool;
    notificationPreferences : {
      alertStyle : {
        #center;
        #top;
      };
      coinChime : Bool;
    };
    displayPreferences : {
      immersive : Bool;
      frameSize : Nat;
      darkIntensity : Nat;
    };
  };

  public type UserProfile = {
    nickname : Text; // royal name
    accountType : {
      #personal;
      #business;
      #royal;
    };
    avatarConfig : {
      color : Text;
      crown : Text;
      clothes : Text;
    };
    linkedAccounts : [Text]; // cosmetic
  };

  let accounts = Map.empty<Principal, UserAccount>();
  let withdrawalLimits = Map.empty<Principal, WithdrawalLimit>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User Profile Functions (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or admin can view any profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Account Management Functions
  public query ({ caller }) func getAccount(user : Principal) : async ?UserAccount {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own account or admin can view any account");
    };
    accounts.get(user);
  };

  public shared ({ caller }) func saveAccount(account : UserAccount) : async () {
    // Must be at least a user to create/modify accounts
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save accounts");
    };

    // Can only modify own account unless admin
    if (caller != account.owner and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only modify your own account");
    };

    accounts.add(account.owner, account);
    withdrawalLimits.add(account.owner, account.withdrawalLimit);
  };

  public query ({ caller }) func getWithdrawalLimit(user : Principal) : async ?WithdrawalLimit {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own withdrawal limit or admin can view any limit");
    };
    withdrawalLimits.get(user);
  };

  public query ({ caller }) func listAllAccounts() : async [UserAccount] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can list all accounts");
    };
    accounts.values().toArray();
  };
};
