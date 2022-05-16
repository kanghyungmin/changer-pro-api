import * as fs from 'fs';
import {
  FireblocksSDK,
  VaultAccountResponse,
  WalletContainerResponse,
  DepositAddressResponse,
  CreateVaultAssetResponse,
  TransactionResponse,
  TransactionFilter,
  PeerType,
  TransactionArguments,
  CreateTransactionResponse,
  VaultAccountsFilter,
  AssetResponse,
  FiatAccountResponse,
} from 'fireblocks-sdk';
import * as _ from 'lodash';

export interface AddressData {
  address: string;
  tag?: string;
  vaultAccountId?: string;
}

export interface GenNewOnlyAddressParam {
  vaultName: string;
  assetName: string;
  customerRefId?: string;
  existVaultId?: string;
  hiddenOnUI?: boolean;
  autoFuel?: boolean;
}

export interface FireBlocksWebhookResult {
  type: string; //"TRANSACTION_CREATED" or TRANSACTION_STATUS_UPDATED
  tenantId: string; //Unique id of your Fireblocks' workspace
  timestamp: number; //Timestamp in milliseconds
  data?: TransactionResponse;
}
export const FIREBLOCKS_TESTNET_API_KEY =
  'bf934890-a7d5-5fa2-b8d4-d56120146d35';
export const FIREBLOCKS_APIKEY: string =
  process.env.FIREBLOCKS_API_KEY || FIREBLOCKS_TESTNET_API_KEY;

export const FIREBLOCKS_OMNIBUS_ACCOUNT_VAULT_ID: string =
  process.env.FIREBLOCKS_OMNIBUS_ACCOUNT_VAULT_ID || '0';
export const FIREBLOCKS_OMNIBUS_ACCOUNT_VAULT_NAME: string =
  FIREBLOCKS_APIKEY === FIREBLOCKS_TESTNET_API_KEY
    ? 'Omnibus'
    : 'Changer-Omnibus';
export const FIREBLOCKS_VAULT_NAME_PREFIX: string =
  process.env.NODE_ENV === 'production' ? 'changer-iv-' : 'test-iv-';
export const FIREBLOCKS_ASSET_DESC_PREFIX: string =
  process.env.NODE_ENV === 'production' ? 'changer-' : 'test-';
export const FIREBLOCKS_ASSET_NAME_SUFFIX_REGEX: RegExp =
  FIREBLOCKS_APIKEY === FIREBLOCKS_TESTNET_API_KEY
    ? /(_TEST|_T|_T2)\b/g
    : /(_ERC20)\b/g;

export default class FireBlocksApiService {
  // main account

  private FIREBLOCKS_PATH_SECRET_KEY_FILE =
    process.env.FIREBLOCKS_PATH_SECRET_KEY_FILE ||
    './keyfile/fireblocks/testnet/fireblocks_secret.key';
  private fireblocks: FireblocksSDK | null = null;
  private GAS_STATION_WALLET_ID =
    process.env.FIREBLOCKS_GAS_STATION_WALLET_ID ||
    'a3a5aaec-6c2d-6485-b439-5e9a44e8d47d';
  private GAS_STATION_ASSET_ID =
    process.env.NODE_ENV === 'production' ? 'ETH' : 'ETH_TEST';
  private gasStationETHaddress: string | null = null;
  constructor() {
    const apiSecret = fs.readFileSync(
      this.FIREBLOCKS_PATH_SECRET_KEY_FILE,
      'utf8',
    );
    this.fireblocks = new FireblocksSDK(apiSecret, FIREBLOCKS_APIKEY);

    this.init();
  }

  private async init() {
    // this.getSupportedAssets();
    // await this.getVaultAccounts();
    // await this.getTransactions();
    // this.sweepIntermediateVaults();
    this.getGasStationInfo();
    // this.getSupportedAssets();
    // this.getInternalWallets();

    // let currencyNm = "ETH_TEST";
    // const suffixRegex = process.env.NODE_ENV === 'production' ? '' : FIREBLOCKS_ASSET_NAME_SUFFIX_REGEX
    // console.log("suffixRegex:", suffixRegex)
    // currencyNm = currencyNm.replace(suffixRegex, "").toLowerCase()
    // console.log("regex test: ", currencyNm);

    // await this.getDepositAddresses("19", "ETH_TEST");

    await this.setGasStationETHaddress();
  }

  private async setGasStationETHaddress() {
    const gasStationWallet = await this.getInternalWallet(
      this.GAS_STATION_WALLET_ID,
    );
    if (gasStationWallet && gasStationWallet.assets) {
      if (gasStationWallet.assets.length > 0) {
        const gasStationAsset = _.find(gasStationWallet.assets, {
          id: this.GAS_STATION_ASSET_ID,
        });
        if (gasStationAsset) {
          console.log('gasStationAsset : ', gasStationAsset);
          this.gasStationETHaddress = gasStationAsset.address;
        }
      }
    }
  }

  public getGasStationAddress() {
    console.log('gasStationAddress : ', this.gasStationETHaddress);
    return this.gasStationETHaddress;
  }

  public async getSupportedAssets() {
    if (this.fireblocks) {
      const result = await this.fireblocks.getSupportedAssets();
      console.log('getSupportedAssets', JSON.stringify(result, null, 2));
    }
  }

  public async setGasStationConfiguration(
    gasThreshold: string,
    gasCap: string,
    maxGasPrice: string,
  ) {
    if (this.fireblocks) {
      const result = await this.fireblocks.setGasStationConfiguration(
        gasThreshold,
        gasCap,
        maxGasPrice,
      );
      console.log('GasStation Result : ', JSON.stringify(result, null, 2));
    }
  }

  public async getGasStationInfo() {
    if (this.fireblocks) {
      const result = await this.fireblocks.getGasStationInfo();
      console.log('GasStation Result : ', JSON.stringify(result, null, 2));
    }
  }

  public async getTransactions(filter: TransactionFilter) {
    let result: TransactionResponse[] | null = null;
    if (this.fireblocks) {
      result = await this.fireblocks.getTransactions(filter);
      console.log(
        'fireblocks getTransactions',
        JSON.stringify(result, null, 2),
      );
    }
    return result;
  }

  public async getFiatAccount(fiatAccountId: string) {
    let result: FiatAccountResponse | null = null;
    if (this.fireblocks) {
      result = await this.fireblocks.getFiatAccountById(fiatAccountId);
      // console.log(JSON.stringify(result, null, 2));
    }
    return result;
  }

  public async getFiatAccounts() {
    let result: FiatAccountResponse[] | null = null;
    if (this.fireblocks) {
      result = await this.fireblocks.getFiatAccounts();
      // console.log(JSON.stringify(result, null, 2));
    }
    return result;
  }

  public async getVaultAccount(vaultAccountId: string) {
    let result: VaultAccountResponse | null = null;
    if (this.fireblocks) {
      result = await this.fireblocks.getVaultAccount(vaultAccountId);
      // console.log(JSON.stringify(result, null, 2));
    }
    return result;
  }

  public async getVaultAccounts(filter?: VaultAccountsFilter) {
    let result: VaultAccountResponse[] | null = null;
    if (this.fireblocks) {
      result = await this.fireblocks.getVaultAccounts(filter);
      // console.log(JSON.stringify(result, null, 2));
    }
    return result;
  }
  public async getInternalWallets() {
    let result: WalletContainerResponse[] | null = null;
    if (this.fireblocks) {
      result = await this.fireblocks.getInternalWallets();
      // console.log(JSON.stringify(result, null, 2));
    }
    return result;
  }
  public async getInternalWallet(walletId: string) {
    let result: WalletContainerResponse | null = null;
    if (this.fireblocks) {
      result = await this.fireblocks.getInternalWallet(walletId);
      // console.log(JSON.stringify(result, null, 2));
    }
    return result;
  }
  public async getExternalWallets() {
    let result: WalletContainerResponse[] | null = null;
    if (this.fireblocks) {
      result = await this.fireblocks.getExternalWallets();
      // console.log(JSON.stringify(result, null, 2));
    }
    return result;
  }
  public async getExternalWallet(walletId: string) {
    let result: WalletContainerResponse | null = null;
    if (this.fireblocks) {
      result = await this.fireblocks.getExternalWallet(walletId);
      // console.log(JSON.stringify(result, null, 2));
    }
    return result;
  }

  public async getDepositAddresses(vaultAccountId: string, assetId: string) {
    let result: DepositAddressResponse[] | null = null;
    if (this.fireblocks) {
      result = await this.fireblocks.getDepositAddresses(
        vaultAccountId,
        assetId,
      );
      console.log(result);
    }
    return result;
  }

  public async createTransaction(params: TransactionArguments) {
    let result: CreateTransactionResponse | null = null;
    if (this.fireblocks) {
      result = await this.fireblocks.createTransaction(params);
      console.log(result);
    }
    return result;
  }

  public async createVaultAccount(
    name: string,
    hiddenOnUI?: boolean,
    customerRefId?: string,
    autoFuel?: boolean,
  ) {
    let result: VaultAccountResponse | null = null;
    if (this.fireblocks) {
      result = await this.fireblocks.createVaultAccount(
        name,
        hiddenOnUI,
        customerRefId,
        autoFuel,
      );
      console.log(result);
    }
    return result;
  }

  public async createVaultAsset(vaultAccountId: string, assetId: string) {
    let result: CreateVaultAssetResponse | null = null;
    if (this.fireblocks) {
      result = await this.fireblocks.createVaultAsset(vaultAccountId, assetId);
      console.log(result);
    }
    return result;
  }
  //ETH,ERC20,OMNI는 각 vault에 하나의 asset과 address만 가질 수 있다.
  public async generateNewOnlyAddress(
    params: GenNewOnlyAddressParam,
  ): Promise<AddressData | null> {
    const {
      vaultName,
      assetName,
      customerRefId,
      existVaultId,
      hiddenOnUI,
      autoFuel,
    } = params;

    let result: AddressData | null = null;

    let vaultId: string | undefined;
    if (!existVaultId) {
      const newVault = await this.createVaultAccount(
        vaultName,
        hiddenOnUI,
        customerRefId,
        autoFuel,
      );
      if (newVault) {
        vaultId = newVault.id;
      }
    } else {
      vaultId = existVaultId;
    }
    if (vaultId) {
      const existAddresses = await this.getDepositAddresses(vaultId, assetName);
      if (existAddresses && existAddresses.length > 0) {
        const existAsset = existAddresses[0];
        result = {
          address: existAsset.address,
          tag: existAsset.tag,
          vaultAccountId: vaultId,
        };
      } else {
        const newAsset: CreateVaultAssetResponse | null =
          await this.createVaultAsset(vaultId, assetName);
        // console.log(newAsset);
        /*  id: string;
            address: string;
            legacyAddress: string;
            enterpriseAddress?: string;
            tag: string;
            eosAccountName: string; */
        if (newAsset) {
          result = {
            address: newAsset.address,
            tag: newAsset.tag,
            vaultAccountId: vaultId,
          };
        }
      }
    }

    // console.log(newVault);
    /* if(newVault){
      const newAsset : CreateVaultAssetResponse | null = await this.createVaultAsset(newVault.id, assetName)
      // console.log(newAsset);
      
      if(newAsset){
        result = {
          address : newAsset.address,
          tag : newAsset.tag,
          vaultAccountId: newVault.id
        }
      }
    } */
    return result;
  }

  public async generateNewAddress(
    vaultAccountId: string,
    assetId: string,
    accountId: string,
  ): Promise<AddressData | null> {
    let result: AddressData | null = null;
    if (this.fireblocks) {
      const description = `${FIREBLOCKS_ASSET_DESC_PREFIX}${accountId}`;
      const newAddress = await this.fireblocks.generateNewAddress(
        vaultAccountId,
        assetId,
        description,
        accountId,
      );
      /* address: string;
    tag?: string;
    legacyAddress?: string;
    enterpriseAddress?: string; */
      console.log(result);

      if (newAddress) {
        result = {
          address: newAddress.legacyAddress
            ? newAddress.legacyAddress
            : newAddress.address,
          tag: newAddress.tag,
        };
      }
    }
    return result;
  }

  public async sweepIntermediateVaults() {
    try {
      const filter: VaultAccountsFilter = {
        minAmountThreshold: 0,
        namePrefix: FIREBLOCKS_VAULT_NAME_PREFIX,
      };
      const vaults = await this.getVaultAccounts(filter);
      console.log(JSON.stringify(vaults, null, 2));
      if (vaults && vaults.length > 0) {
        // make transactionArgList;
        const transactionArgs: TransactionArguments[] = [];
        vaults.forEach((vault) => {
          let assets: AssetResponse[] = vault.assets;
          // assets가 2개 이상이고 eth가 있으면 일단 eth를 제외시킨다.
          if (assets.length > 1) {
            assets = assets.filter((asset) => asset.id !== 'ETH');
          }
          const transactionArgList = assets.map((asset) => {
            const transactionArguments: TransactionArguments = {
              assetId: asset.id,
              source: {
                type: PeerType.VAULT_ACCOUNT,
                id: vault.id,
              },
              destination: {
                type: PeerType.VAULT_ACCOUNT,
                id: FIREBLOCKS_OMNIBUS_ACCOUNT_VAULT_ID,
              },
              amount: asset.available,
            };
            return transactionArguments;
          });

          // console.log("transactionArguments: ", transactionArguments)
          // return this.createTransactioin(transactionArguments)
          transactionArgs.push(...transactionArgList);
        });

        console.log('final sweep transactionArgs: ', transactionArgs);
        const transactionPromises = transactionArgs.map((transactionArg) => {
          return this.createTransaction(transactionArg);
        });

        await Promise.all(transactionPromises);
      }
    } catch (e) {
      console.error(e);
    }
  }
}
