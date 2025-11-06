"use client";
import { useState } from "react";
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Copy, ExternalLink } from 'react-feather';

const UserSettingsPage = () => {
  const { authenticated, user, login, linkEmail, linkWallet, unlinkEmail, unlinkWallet } = usePrivy();
  const { wallets } = useWallets();

  const [settings, setSettings] = useState({
    displayName: "",
    email: "",
    notifications: true,
    privateProfile: false,
  });
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    // TODO: Implement save settings functionality
    console.log("Saving settings:", settings);
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!authenticated) {
    return (
      <section className="flex flex-col w-[75vw] gap-[2.222vw] items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-[1.111vw]">
          <h1 className="text-white font-jakarta font-bold text-[1.667vw]">
            Connect Your Wallet
          </h1>
          <p className="text-white/60 font-jakarta text-[1.111vw]">
            Please connect your wallet to view settings
          </p>
          <button
            onClick={login}
            className="mt-[1.111vw] px-[2vw] py-[1vw] bg-gradient-to-r from-[#8B609B] to-[#302135] rounded-[0.5vw] text-white font-jakarta font-medium text-[1.111vw] hover:opacity-80 transition-opacity"
          >
            Connect Wallet
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col w-full gap-[2.222vw]">
      <h1 className="text-white font-jakarta font-bold text-[2.222vw]">
        Settings
      </h1>

      {/* Wallet & Account Info */}
      <div className="flex flex-col gap-[1.111vw] bg-gradient-to-r from-[#8B609B]/20 to-[#302135]/20 rounded-[0.833vw] p-[2.222vw] border border-white/10">
        <h2 className="text-white font-jakarta font-semibold text-[1.389vw]">
          Connected Accounts
        </h2>

        {/* User ID */}
        {user?.id && (
          <div className="flex flex-col gap-[0.556vw]">
            <label className="text-white/60 font-jakarta text-[0.889vw]">
              User ID
            </label>
            <p className="text-white font-jakarta text-[1.111vw] font-mono">
              {user.id}
            </p>
          </div>
        )}

        {/* Email Accounts */}
        {user?.email && (
          <div className="flex flex-col gap-[0.556vw]">
            <label className="text-white/60 font-jakarta text-[0.889vw]">
              Email
            </label>
            <div className="flex flex-row items-center justify-between bg-black/30 rounded-[0.556vw] px-[1.111vw] py-[0.833vw]">
              <p className="text-white font-jakarta text-[1.111vw]">
                {user.email.address}
              </p>
              <span className="text-[#72FFC7] font-jakarta text-[0.889vw] bg-[#72FFC7]/20 px-[0.833vw] py-[0.278vw] rounded-[0.278vw]">
                Verified
              </span>
            </div>
          </div>
        )}

        {/* Linked Wallets */}
        {wallets.length > 0 && (
          <div className="flex flex-col gap-[0.556vw]">
            <label className="text-white/60 font-jakarta text-[0.889vw]">
              Connected Wallets ({wallets.length})
            </label>
            <div className="flex flex-col gap-[0.556vw]">
              {wallets.map((wallet, index) => (
                <div
                  key={wallet.address}
                  className="flex flex-row items-center justify-between bg-black/30 rounded-[0.556vw] px-[1.111vw] py-[0.833vw]"
                >
                  <div className="flex flex-col gap-[0.278vw]">
                    <p className="text-white font-jakarta text-[1.111vw] font-mono">
                      {formatAddress(wallet.address)}
                    </p>
                    <p className="text-white/60 font-jakarta text-[0.778vw]">
                      {wallet.walletClientType === 'privy' ? 'Embedded Wallet' : `External Wallet (${wallet.walletClientType})`}
                    </p>
                  </div>
                  <div className="flex flex-row items-center gap-[0.556vw]">
                    <button
                      onClick={() => handleCopyAddress(wallet.address)}
                      className="p-[0.417vw] hover:bg-white/10 rounded-[0.278vw] transition-colors"
                      title="Copy address"
                    >
                      <Copy color="white" size={14} />
                    </button>
                    <a
                      href={`https://etherscan.io/address/${wallet.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-[0.417vw] hover:bg-white/10 rounded-[0.278vw] transition-colors"
                      title="View on Etherscan"
                    >
                      <ExternalLink color="white" size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
            {copied && (
              <p className="text-[#72FFC7] font-jakarta text-[0.778vw]">
                Address copied!
              </p>
            )}
          </div>
        )}

        {/* Social Connections */}
        {(user?.google || user?.twitter || user?.discord || user?.github) && (
          <div className="flex flex-col gap-[0.556vw]">
            <label className="text-white/60 font-jakarta text-[0.889vw]">
              Social Accounts
            </label>
            <div className="flex flex-col gap-[0.556vw]">
              {user?.google && (
                <div className="flex flex-row items-center justify-between bg-black/30 rounded-[0.556vw] px-[1.111vw] py-[0.833vw]">
                  <div className="flex flex-row items-center gap-[0.556vw]">
                    <span className="text-white font-jakarta text-[1.111vw]">🌐</span>
                    <p className="text-white font-jakarta text-[1.111vw]">
                      Google - {user.google.email}
                    </p>
                  </div>
                </div>
              )}
              {user?.twitter && (
                <div className="flex flex-row items-center justify-between bg-black/30 rounded-[0.556vw] px-[1.111vw] py-[0.833vw]">
                  <div className="flex flex-row items-center gap-[0.556vw]">
                    <span className="text-white font-jakarta text-[1.111vw]">🐦</span>
                    <p className="text-white font-jakarta text-[1.111vw]">
                      Twitter - {user.twitter.username}
                    </p>
                  </div>
                </div>
              )}
              {user?.discord && (
                <div className="flex flex-row items-center justify-between bg-black/30 rounded-[0.556vw] px-[1.111vw] py-[0.833vw]">
                  <div className="flex flex-row items-center gap-[0.556vw]">
                    <span className="text-white font-jakarta text-[1.111vw]">💬</span>
                    <p className="text-white font-jakarta text-[1.111vw]">
                      Discord - {user.discord.username}
                    </p>
                  </div>
                </div>
              )}
              {user?.github && (
                <div className="flex flex-row items-center justify-between bg-black/30 rounded-[0.556vw] px-[1.111vw] py-[0.833vw]">
                  <div className="flex flex-row items-center gap-[0.556vw]">
                    <span className="text-white font-jakarta text-[1.111vw]">⚡</span>
                    <p className="text-white font-jakarta text-[1.111vw]">
                      GitHub - {user.github.username}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Link Additional Accounts */}
        <div className="flex flex-row gap-[0.833vw] mt-[0.556vw]">
          {!user?.email && (
            <button
              onClick={linkEmail}
              className="px-[1.5vw] py-[0.667vw] bg-white/10 hover:bg-white/20 border border-white/20 rounded-[0.556vw] text-white font-jakarta text-[0.889vw] transition-colors"
            >
              + Link Email
            </button>
          )}
          <button
            onClick={linkWallet}
            className="px-[1.5vw] py-[0.667vw] bg-white/10 hover:bg-white/20 border border-white/20 rounded-[0.556vw] text-white font-jakarta text-[0.889vw] transition-colors"
          >
            + Link Wallet
          </button>
        </div>
      </div>

      {/* Profile & Privacy Settings */}
      <div className="flex flex-col gap-[1.667vw] bg-neutral-400 rounded-[0.833vw] p-[2.222vw]">
        {/* Profile Settings */}
        <div className="flex flex-col gap-[1.111vw]">
          <h2 className="text-white font-jakarta font-semibold text-[1.389vw]">
            Profile
          </h2>

          <div className="flex flex-col gap-[0.556vw]">
            <label className="text-white font-jakarta text-[1.111vw]">
              Display Name
            </label>
            <input
              type="text"
              value={settings.displayName}
              onChange={(e) =>
                setSettings({ ...settings, displayName: e.target.value })
              }
              placeholder="Enter your display name"
              className="w-full px-[1.111vw] py-[0.833vw] bg-neutral-black-base border border-neutral-black-light rounded-[0.556vw] text-white font-jakarta text-[1.111vw] outline-none focus:border-purple-base"
            />
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="flex flex-col gap-[1.111vw]">
          <h2 className="text-white font-jakarta font-semibold text-[1.389vw]">
            Privacy
          </h2>

          <div className="flex flex-row items-center justify-between">
            <label className="text-white font-jakarta text-[1.111vw]">
              Enable Notifications
            </label>
            <button
              onClick={() =>
                setSettings({ ...settings, notifications: !settings.notifications })
              }
              className={`w-[3.333vw] h-[1.667vw] rounded-full transition-colors ${
                settings.notifications ? "bg-purple-base" : "bg-neutral-black-light"
              }`}
            >
              <div
                className={`w-[1.389vw] h-[1.389vw] rounded-full bg-white transition-transform ${
                  settings.notifications ? "translate-x-[1.667vw]" : "translate-x-[0.278vw]"
                }`}
              />
            </button>
          </div>

          <div className="flex flex-row items-center justify-between">
            <label className="text-white font-jakarta text-[1.111vw]">
              Private Profile
            </label>
            <button
              onClick={() =>
                setSettings({ ...settings, privateProfile: !settings.privateProfile })
              }
              className={`w-[3.333vw] h-[1.667vw] rounded-full transition-colors ${
                settings.privateProfile ? "bg-purple-base" : "bg-neutral-black-light"
              }`}
            >
              <div
                className={`w-[1.389vw] h-[1.389vw] rounded-full bg-white transition-transform ${
                  settings.privateProfile ? "translate-x-[1.667vw]" : "translate-x-[0.278vw]"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="mt-[1.111vw] w-full py-[0.833vw] bg-purple-base hover:bg-purple-dark transition-colors rounded-[0.556vw] text-white font-jakarta font-medium text-[1.111vw]"
        >
          Save Changes
        </button>
      </div>
    </section>
  );
};

export default UserSettingsPage;
