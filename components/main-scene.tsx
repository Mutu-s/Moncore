"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, OrbitControls, Float, Sphere, Html } from "@react-three/drei"
import type { Group } from "three"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { ethers, BrowserProvider } from "ethers" // Import ethers

const rawTSVData = `NAME	LOGO	PJ TYPE	TAGS	X	WEB	BANNER	INFO	ONLY on Monad	🟥 = sus / website link broken / dead pjs
0x	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9106b6ca74a7001624998_0x_logo.webp	Infra	Dev,Tooling	https://x.com/0xProject	https://0x.org/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b910681d1e917a4b1a10d9_0x_banner.webp	0x allows you to embed swaps in any onchain app. Tap into aggregated liquidity from 130+ sources, best prices & optimal trade execution.	No	
AUSD	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67c620f4a0bab10af98e0508_ausd.webp	App/Infra	DeFi	https://x.com/withAUSD	https://agora.finance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67c620f148f4cde61d6cf7fb_ausd%20(1).webp	Agora is a stablecoin issuer of AUSD, backed 1:1 by cash and cash equivalent reserves managed by VanEck and custodied by State Street.	No	
AZEx	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67e316cec7faf77a521ebdc3_AZEX-icon-wht-background-300x300.webp	App	DeFi	https://x.com/azex_io	https://azex.io/home	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67e316c93c4aa7bb9abb6b5c_azex%20banner.webp	Your A-Z DeFi Hub in One Click. Trade any asset as margin with 100x leverage. Multi-Chain Protocol. AI-Powered Copytrading.	No	
Aarna	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6834a164fae7947828580000_Twitter-Logo.webp	App	DeFi	https://x.com/aarnasays	https://www.aarna.ai/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6834a164fae794782857fffd_1500x500-2-.webp	Next-generation DeFi asset management platform via crypto structured products, merging AI and tokenization.	No	
Accountable	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68a7302c461b97699ee0f421_Profile%20Pic%20(7)%20(1).webp	App	DeFi	https://x.com/AccountableData	https://yield.accountable.capital/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68a730300920180531983ce9_x_cover_business%20(1).webp	YieldApp is the first yield marketplace backed by live, cryptographically verifiable data users can trust.	Yes	
Across Protocol	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68e035994e3c2ccadb2a907a_X-Logo.webp	Infra	Cross-Chain	https://x.com/AcrossProtocol	https://across.to/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68e035994e3c2ccadb2a907d_X-Banner-1500x500-.webp	Across is the first intent-based crosschain bridge protocol. It's fast, cheap, and secure. Powering $30B+ in volume for 4M+ users.	No	
Acurast	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b910bc10f685d8b1690a43_Acurast_logo.webp	App/Infra	DePIN	https://x.com/Acurast	https://acurast.com/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b910bace65acecef527de2_Acurast_banner.webp	Confidential AI, hyper-personalized agents, and privacy-focused computation using thousands of smartphones worldwide.	No	
AethonSwap	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68e0395d301c8d49539f8fed_AethonSwap-icon-Twitter-1-2-.webp	App	DeFi	https://x.com/AethonSwap	https://www.aethonswap.com/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68e0395d301c8d49539f8ff5_aethonswap-twitter-banner-3-1-.webp	AethonSwap is a CLAMM V4 DEX combining next-gen tech with intelligent design, for low-slippage trading &amp; efficient liquidity management	Yes	
Alchemy	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b910dc1f770571ff122b0c_Alchemy_logo.webp	Infra	Dev,Tooling	https://x.com/Alchemy	https://alchemy.com	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b910df442716854f1f207e_Alchemy_banner.webp	Alchemy's end-to-end platform gives devs everything to build and scale web3 apps - from APIs to monitoring, across multiple chains.	No	
AllDomains	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67e316a9407f35c90acd3348_LoFnPgJa_400x400.webp	Infra	Identity	https://x.com/alldomains	https://monad.alldomains.id/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67e316a9407f35c90acd334b_1500x500-2-.webp	AllDomains: the web3 identity asset layer to create and trade web3 domains | Customizable for everyone.	No	
Allium	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b910eaea5cc3512a8a1b8f_Allium_logo.webp	Infra	Analytics	https://x.com/AlliumLabs	https://www.allium.so/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b910ed033e2b1def73adaa_Allium_banner.webp	Allium delivers blockchain data for analytics, applications, and accounting use cases via dashboards, APIs, datashares, and data streams.	No	
Ambient	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b910fa442716854f1f3390_Ambient_logo.webp	App	DeFi	https://x.com/ambient_finance	https://monad.ambient.finance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b910f8442716854f1f312c_Ambient_banner.webp	Spot AMM with combining multiple liquidity types with modular hooks, dynamic fees and MEV protection.	No	
Ambire Wallet	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67f6640db8ed2eac26fe4faa_DAyumIRU_400x400.webp	Infra	Wallet	https://x.com/ambirewallet	https://www.ambire.com	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67d3a0a7984211865e3ea8ec_Change-X-Hero-Image-Issue-1537.webp	Еasy and secure self-custody for smart accounts, EOAs, and hardware wallets. EIP-7702 ready wallet.	No	
Amertis	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67cb75a41f9084980878c240_amertis_logo.webp	App	DeFi	https://x.com/AmertisExchange	https://amertis.exchange/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67cb75a41f9084980878c243_amertis_banner.webp	Connecting users to deep liquidity across multiple sources, ensuring the best rates, minimal slippage, and an optimised DeFi experience.	Yes	
Ammalgam	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b911051d1e917a4b1ab9b8_Ammalgam_logo.webp	App	DeFi	https://x.com/Ammalgam	https://alpha.ammalgam.xyz/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91108f6be2d85fbd272a3_Ammalgam_banner.webp	Ammalgam is a new primitive that combines lending and trading into one protocol called a Decentralized Lending Exchange.	No	
ApeBond	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67eff2c5822ee4e28e47f43b_logo.webp	App	DeFi	https://x.com/apebond	https://ape.bond	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67eff2c5822ee4e28e47f441_banner.webp	The #1 Bonding Protocol in DeFi, with $20M+ bonded and 80k+ bonds sold, transforming how projects raise funds and secure liquidity.	No	
Apriori	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91139ebe3a25cc1bbc74f_Apriori_logo.webp	App	DeFi	https://x.com/apriori	http://testnet-staking.apr.io	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b911371d1e917a4b1ad43f_Apriori_banner.webp	aPriori is an MEV infrastructure and liquid staking protocol, designed for the parallel execution era and natively built on Monad.	Yes	
Atlantis	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67d3a0a71b288e2e961f005f_400x400.webp	App	DeFi	https://x.com/atlantisdex_xyz	https://atlantisdex.xyz	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67d3a0a71b288e2e961f005c_1500x500.webp	Modular V4 DEX offering cross-chain swaps, DeFAI, a launchpad, farming, staking, fiat on-ramp, &amp; more.	Yes	
Atomic Wallet	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6806075774f1032f79627b16_c5FE7avh_400x400.webp	Infra	Wallet	https://x.com/atomicwallet	https://atomicwallet.io/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6853207f608eafe16f68161b_atomic%20banner.webp	Manage, exchange, and stake 1000+ assets securely on desktop &amp; mobile.	No	
Azaar	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91170f43c1f7d17690959_Azaar_logo.webp	App	DeFi	https://x.com/AzaarExchange	https://azaar.com/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91173b0307a90b7b1b0c4_Azaar_banner.webp	Azaar is a high-performance DEX aggregator and trading platform built for Monad.	No	
Backpack Wallet	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91182d6f6cc072b1dbb7e_Backpack%20Wallet_logo.webp	Infra	Wallet	https://x.com/Backpack	https://backpack.app/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91180f43c1f7d1769200f_Backpack%20Wallet_banner.webp	Backpack is a next-level wallet and exchange. Buy tokens, trade futures, and explore on-chain apps—seamlessly and securely. 🎒	No	
Balancer	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91e5302389168368b4f29_Balancer%20logo.webp	App	DeFi	https://x.com/Balancer	https://balancer.fi/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91e60ab78b729a9289a4c_Balancer%20Banner.webp	Balancer is a decentralized automated market maker (AMM) protocol built on Ethereum.	No	
Band Protocol	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67e317a398baf3c13c00aa31_band-token-blue-1-logo.webp	Infra	Oracle	https://x.com/BandProtocol	https://www.bandprotocol.com/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67e317a6a79803c3bc66316e_band%20brotocol%20banner.webp	Band Protocol is a cross-chain data oracle platform that aggregates and connects real-world data and APIs to smart contracts.	No	
Bean Exchange	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9118b1f770571ff12b289_Bean%20Exchange_logo.webp	App	DeFi	https://x.com/Bean_DEX	https://bean.exchange/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9118e5481bdf7e82958ac_Bean%20Exchange_banner.webp	Bean Exchange is a gamified decentralized spot &amp; perpetual exchange natively built on Monad Network.	Yes	
Bebop	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9119cddf104de2b1e6e20_Bebop_logo.webp	App	DeFi	https://x.com/bebop_dex/	https://bebop.xyz/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9119a8b0b0587034738d1_Bebop_banner.webp	Seamless and efficient crypto trading for everyone. Web3 trading app and API that finds the best route for all your trades.	No	
Biconomy	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b911a9dec63edfce3e07fb_Biconomy_logo.webp	Infra	Account,Abstraction	https://x.com/biconomy	http://biconomy.io	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b911ab033e2b1def743657_Biconomy_banner.webp	Biconomy helps devs build user-friendly dApps with modular tools. Our stack powers 300+ dApps &amp; 50M+ transactions, accelerating adoption.	No	
Bima	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b911b7f19afa8887c82193_Bima_logo.webp	App	DeFi	https://x.com/bimabtc	https://bima.money/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b911b4032221af82c42e0a_Bima_banner.webp	BIMA is a DeFi platform that lets you earn yield on your BTC across multiple chains by using USBD, a Bitcoin-backed stablecoin.	No	
Birdeye	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68f69b4da7d3625a521dd18a_Group-17.webp	App	DeFi	https://x.com/birdeye_so	https://birdeye.so/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68f69b4da7d3625a521dd18f_BSO-x-Banner.webp	The all-in-one trading data tool for alpha traders: real-time charts, smart money flows, gems &amp; historical data across 300+ exchanges.	No	
Birdeye Data Services	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68f69b4d2971afdf6a18ab24_Group-18.webp	Infra	Indexer	https://x.com/birdeye_data	https://bds.birdeye.so/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68f69b4d2971afdf6a18ab28_BDS-x-Banner.webp	High-performance onchain data provider with real-time, accurate data across tokens, wallets &amp; protocols.	No	
Bitget Wallet	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b911c2bfbd83279f12cf05_Bitget%20Wallet_logo.webp	Infra	Wallet	https://x.com/BitgetWallet	https://web3.bitget.com	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b911c0033e2b1def74443d_Bitget%20Wallet_banner.webp	Bitget Wallet is a non-custodial wallet with advanced multi-chain capabilities and a powerful swap function.	No	
Blazpay	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b911d4f6be2d85fbd30525_Blazpay_logo.webp	App	DeFi	https://x.com/blazpaylabs	https://blazpay.com	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b911d2de4da514b324986f_Blazpay_banner.webp	Blazpay AI: Simplifying Crypto | 1.2M+ Users | AI-Swap | Portfolio | Alerts | Cross-Chain | Gamified Learning | Multi-Platform	No	
BlockStreet	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68b20be38a9f4a238e4ca802_monad-logo-400_400.webp	Infra	Other,Infra	https://x.com/blockst_hq	https://blockstreet.money/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68b20be38a9f4a238e4ca7ef_monad-bg-1500x500.webp	Unified liquidity layer for tokenized equities - delivering secure settlement, deep liquidity, and institutional-grade efficiency.	No	
BlockVision	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b911e5ebe3a25cc1bc45a5_BlockVision_logo.webp	Infra	Indexer	https://x.com/blockvisionhq	https://blockvision.org/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b911e2de4da514b324a0d5_BlockVision_banner.webp	BlockVision provides blockchain infrastructure services, offering APIs, RPC services to empower developers and users alike.	No	
Blockdaemon	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b911f1b0307a90b7b20ade_Blockdaemon_logo.webp	Infra	RPC	https://x.com/BlockdaemonHQ	https://www.blockdaemon.com/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b911ee033e2b1def746334_Blockdaemon_banner.webp	Blockdaemon provides enterprise-grade web3 infrastructure, including dedicated nodes, APIs, staking, liquid staking, MPC wallets, and more.	No	
Blocklive	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b911fd7f3041834a53238c_Blocklive_logo.webp	App	NFT	https://x.com/blocklive_/	https://blocklive.io	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b911ffebe3a25cc1bc5a93_Blocklive_banner.webp	Blocklive is a platform for end-to-end onchain event management and ticketing, using proof of history to target and reward fans.	No	
Breath of Estova	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/687816c09a34ff481b1be028_estova%20logo%20_400x400.webp	App	Gaming	https://x.com/BreathOfEstova	https://www.breathofestova.com/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/687816be44e9942c1c1ef114_estova%20background%201500x500%20(1).webp	Breath of Estova is a play-to-earn 2D action-based MMORPG where classic nostalgia meets a vast open world.	Yes	
Buzzing App	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6878174f5c502efdbed88f8b_buzzing%20qbn4VqZ0_400x400.webp	App	Prediction,Market	https://x.com/BuzzingApp	https://www.buzzing.app/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/687817535bd84bf1c05d423e_buzzing%201500x500%20(1).webp	Buzzing Club is an app where users trade opinions on trending topics.	Yes	
Bybit Web3 Wallet	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b912533b92e175eb004a8c_Bybit%20Web3%20Wallet_logo.webp	Infra	Wallet	https://x.com/Bybit_Web3	https://www.bybit.com/en/web3	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91252b76bbf068dcd1c8c_Bybit%20Web3%20Wallet_banner.webp	Bybit Web3 is your gateway to Web3. Explore DeFi offerings, and trade thousands of tokens across various networks.	No	
Clober	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67bebcb9cf681db7a60d2e22_clober.webp	App	DeFi	https://x.com/CloberDEX	https://alpha.clober.io	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67bebcbda054d8dee3799b11_clober%20monad.webp	Clober is a fully on-chain CLOB DEX protocol with a gas-efficient matching engine optimized for on-chain execution.	No	
CoNFT	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67c6400453e750640690be80_conft.webp	App	NFT	https://x.com/ConftApp	https://conft.app	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67cb771049486c6eb222c702_conft%20(1).webp	coNFT.app-NFT aggregator where users can create/trade NFT and register web3 domains.120k MAU. 1M+ mints. 70k+ web3 registrations.	No	
Codex	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b912df3b92e175eb00c2f8_Codex_logo.webp	Infra	Indexer	https://x.com/trycodex	https://www.codex.io	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b912ddae2274c79f98768c_Codex_banner.webp	The Codex API provides fast and accurate enriched data, meticulously structured to easily plug straight into your application.	No	
Coin98 AI Wallet	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b912eaf20a63404b11b01c_Coin98%20AI%20Wallet_logo.webp	Infra	AI	https://x.com/coin98_wallet	https://coin98.com/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b912e8de3f023f51d1d7c4_Coin98%20AI%20Wallet_banner.webp	Crypto Messenger &amp; AI Wallet. Everyone's Gateway to The Open Internet.	No	
Covenant	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91321ea5cc3512a8be053_Covenant_logo.webp	App	DeFi	https://x.com/covenantFi	https://covenant.finance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9131fa3562438106116ea_Covenant_banner.webp	Lever up your favorite token, or earn yield, through liquid, tradeable debt markets.	No	
Crust Finance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6802d4bfe173e30b685ba3ea__EZGsvtJ_400x400%20(1).webp	App	DeFi	https://x.com/CrustFinance	https://crust.finance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6802d4c3f491d1780dd47583_1500x500%20(1)%20(1).webp	Crust Finance is a metadex with concentrated liquidity and native ALM support, built on Monad.	Yes	
Crystal	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91338de4da514b3258311_Crystal_logo.webp	App	DeFi	https://x.com/CrystalExch	https://crystal.exchange	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91336a1ed529049cd029d_Crystal_banner.webp	Crystal is a fully on-chain CLOB exchange that brings CEX-grade performance to the EVM without compromising on security or composability.	Yes	
Cult Markets	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6847444702a242ed322515e4_cultL.webp	App	NFT	https://x.com/cultmarkets	https://testnet.cultmarkets.com/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6847444702a242ed322515ec_cultmarkets_banner.webp	Gamified omnichain NFT marketplace powering dynamic drops, collectibles, and interactive shard-based campaigns.	No	
Curvance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9137ae970ab23ad8030be_Curvance_logo.webp	App	DeFi	https://x.com/Curvance	https://monad.curvance.com/monad	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9137cce65acecef54658a_Curvance_banner.webp	Curvance is a multichain liquidity protocol that maximizes capital efficiency in DeFi.	No	
Cycle Network	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91388b126dbefee6fe84d_Cycle%20Network_logo.webp	Infra	Cross-Chain	https://x.com/cyclenetwork_GO	https://www.cyclenetwork.io/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91386dec63edfce3f80b2_Cycle%20Network_banner.webp	Cycle Network offers bridgeless liquidity abstraction through verifiable state aggregation, supporting all BTC and EVM networks	No	
Cyferio	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91393ebe3a25cc1be0cc4_Cyferio_logo.webp	Infra	Privacy	https://x.com/cyferio_labs	https://cyferio.com/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9139678fa3e34d90a5b90_Cyferio_banner.webp	Award-winning Cyferio Hub offers modular FHE rollup tech for confidential, scalable blockchain computing and privacy-preserving apps.	No	
DAU Cards	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b913a278f79de0e7a62b38_DAU%20Cards_logo.webp	App	Payments	https://x.com/DAUCards	https://gmonad.daucards.com/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b913a4ea5cc3512a8c6485_DAU%20Cards_banner.webp	DAU Cards bridges your crypto to everyday spending in seconds. Our interface-agnostic platform unlocks access to 40M+ global merchants.	No	
DRKVRS	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67d3a1aa464cdce0ecbee499_drkvrs%20jpg.webp	App	Gaming	https://x.com/drkvrs	https://www.drkvrs.io	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67d3a1aea4d25d753f9215c7_drkvrs%20banner%20(1).webp	DRKVRS is a Web3 Multiplayer Action RPG game with innovative mechanics, set in a dystopian and brutalist world.	No	
DRPC	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b913b7b9188e59b9a50568_DRPC_logo.webp	Infra	RPC	https://x.com/drpcorg	https://drpc.org	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b913b9c0e02b5b7bef2682_DRPC_banner.webp	dRPC is an off-chain routing protocol for delivering reliable API infrastructure leveraging a distributed network of nodes.	No	
DashX	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67bebd535f9f62cdf559f308_dashx%20logo.webp	App	DeFi	https://x.com/dashxhq	https://dashx.xyz	NONE	DashX: One-click payments for everything. A DeFi platform with the fastest cross-chain transactions, ramps, and rewards!	No	
Defined	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b913c47f3041834a5454df_Defined_logo.webp	Infra	Analytics	https://x.com/definedfi	https://defined.fi	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b913c62a3730e911b60d80_Defined_banner.webp	Defined is the fastest charting platform serving 70+ networks and 25+ million tokens.	No	
Demask Finance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b913d97f3041834a54624e_Demask%20Finance_logo.webp	App	NFT	https://x.com/demaskfinance	https://demask.finance/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b913dac0e02b5b7bef3bef_Demask%20Finance_banner.webp	Demask Finance is an on-chain AMM protocol that enables trading between NFT collectibles and native tokens.	Yes	
Dialect	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b913e4c3ad7da1ddf1c27c_Dialect_logo.webp	Infra	Other,Infra	https://x.com/saydialect	http://www.dialect.to	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b913e5e21ffe4d1050d95f_Dialect_banner.webp	A toolkit to integrate onchain experiences into your app, instantly.	No	
Diffuse	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b913ef859d08f0b8d743ef_Diffuse_logo.webp	Infra	Zero-Knowledge	https://x.com/DiffuseFi	https://www.diffuse.fi/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b913edb126dbefee70369b_Diffuse_banner.webp	Diffuse is a zk serverless protocol that delivers fast, cost-efficient, and verifiable both on/off-chain data any project needs.	No	
Dirol Protocol	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67cb75a360ac4f826e2f7ec3_photo_2025-03-03_14-07-29.webp	App	DeFi	https://x.com/DirolProtocol	https://dex.dirol.io/swap	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67cb776ce2f730919914482f_Dirol%20Banner%20(1).webp	Dirol is a native DeFi Hub on Monad with a full suite of DeFi features. You can do everything on Dirol.	Yes	
DiscoCats	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b913f93b92e175eb01aa03_DiscoCats_logo.webp	App	DeFi	https://x.com/mydiscocats	https://mydiscocats.com/	NONE	We make locked assets liquid, offering multi-layer yield through Liquid NFTs and Bribe mechanisms with our four products.	No	
Doppler	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67bebd1b38a780964089324a_doppler.webp	Infra	Other,Infra	https://x.com/dopplerprotocol	https://doppler.lol/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67bebd1e315fb4f90a5cf4ba_doppler%20banner.webp	Doppler is an easy to integrate token creation protocol. It automates finding fair prices and getting AMMs like Uniswap bootstrapped.	No	
Drake	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6847444575685e46bfbc9a83_400x400-1-.webp	App	DeFi	https://x.com/DrakeExchange	https://drake.exchange/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6847444675685e46bfbc9a8a_v2-banner.webp	Drake's hybrid CLOB unlocks CEX speed, DEX transparency, and frictionless yields, resulting in what matters most: perps that feel right	Yes	
Dune	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91412f9180e8745b286a5_Dune_logo.webp	Infra	Analytics	https://x.com/Dune	http://dune.com/home	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91411e21ffe4d1050f3ad_Dune_banner.webp	Dune is the leading data platform for onchain data, empowering users to query, visualize, and build across 90+ blockchains.	No	
Dusted	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9141c84cbdc367d620003_Dusted_logo.webp	App	Social	https://x.com/dusted_app	https://www.dusted.app	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9141ce0429ca00f4f3f18_Dusted_banner.webp	Connect with every community member in token-specific chat rooms, earn Dusted points, and win prizes from other Monad projects.	No	
Dynamic	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91426859d08f0b8d76748_Dynamic_logo.webp	Infra	Account,Abstraction	https://x.com/dynamic_xyz	https://www.dynamic.xyz/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9142473996311554ca9af_Dynamic_banner.webp	Dynamic combines authentication, smart wallets, and secure key management into one flexible SDK.	No	
Dyson Finance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67e316a97d15a048a0c7a43e_twitter_profile_1x.webp	App	DeFi	https://x.com/DysonFinance	https://dyson.finance/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67e316a97d15a048a0c7a46c_twitter_pre_launch_cover_4x.webp	Dyson Finance makes DeFi more inclusive and profitable by combining dynamic AMM, Dual Investment, and a Membership Program.	No	
ELFi	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68474446020515eb7453f848_logo.webp	App	DeFi	https://x.com/ELFiProtocol	https://www.elfi.xyz/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68474446020515eb7453f84b_banner.webp	ELFi is the first DEX with ultra portfolio margin &amp; zero-risk stablecoin pool. No KYC. $1.62B volume, 32K users, up to 1000x leverage.	No	
EOracle	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b914331e79a03f6da4a7b7_EOracle_logo.webp	Infra	Oracle	https://x.com/EO_Network	https://www.eoracle.io/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b914357f3041834a54a50e_EOracle_banner.webp	eOracle provides price feeds through a cryptoeconomically secure oracle network.	No	
Eisen Finance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6893bd214907ffb0bd6905ae_Eisen_Symbol.webp	App	DeFi	https://x.com/EisenLabs	https://eisenfinance.com/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6893bd214907ffb0bd6905b6_x-banner.webp	Eisen is a multichain DEX aggregator expanding with V2 to unify CEX/DEX spot &amp; derivatives for advanced DeFi strategies.	No	
Enjoyoors	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/682eef8db64860c25b79c9c6_Enjoyoors_logo.webp	App	DeFi	https://x.com/enjoyoorsxyz	https://enjoyoors.xyz	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/682eef78202dc7cc8af07d6d_Header_enjoyoors.webp	Enoyoors is a protocol that unlocks yield on any asset on any chain.	No	
Entangle	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67cb77e4c1b4e4169e9d7662_entangle-logo.webp	Infra	Cross-Chain	https://x.com/Entanglefi	https://entangle.fi/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67cb77e668afbbbcfdeaab59_entangle-banner.webp	Blockchains are fragmented, blocking data, liquidity/tokens. Our interoperability stack unifies Web3.	No	
Envio	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91462c1a6a111c71df6fd_Envio_logo.webp	Infra	Indexer	https://x.com/envio_indexer	https://envio.dev/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91446e882d110b44a24af_Envio_banner.webp	Envio is a modern, multi-chain EVM blockchain indexer for querying real-time and historical data.	No	
Euclid Protocol	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6883f9e5ab45980310bb5983_euclid%20logo%20.webp	Infra	Dev,Tooling	https://x.com/EuclidProtocol	https://www.euclidprotocol.io/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6883f9f05ed6d256a415dd27_euclid%20banner.webp	Euclid is the first liquidity consensus layer, letting any dApp instantly access liquidity from 50+ networks—no bridging needed.	No	
Euler	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9148448ee25af9bdeb78a_Euler_logo.webp	App	DeFi	https://x.com/eulerfinance/	http://euler.finance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9148784cbdc367d624331_Euler_banner.webp	Euler revolutionizes DeFi by letting any asset become collateral for a lending market.	No	
FUKU	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67c4e7cee99fbe7860f5ac2d_fuku.webp	App	DeFi	https://x.com/Fuku_nad	https://testnet.fukunad.xyz/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67c4e7d195901a1d7451f9d8_fuku%20b.webp	A Defi Saving protocol on Monad, blending savings with the excitement of betting and winning prizes without risking your deposit.	No	
FWX	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6847444652fc2d7b6454b30f_fwx-logo.webp	App	DeFi	https://x.com/fwxfinance	https://fwx.finance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6847444652fc2d7b6454b312_fwx-banner.webp	FWX: Permissionless leverage trading on DEX. Add any token, create a lending pool, and margin trade. Lenders are protected via hedging.	No	
Fans3 AI	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68782bc80d889748856753b5_fan3%20logo%20DZcQNjA2_400x400.webp	App	AI	https://x.com/Fans3_AI	https://www.fans3.ai/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/688d2cfa82f4a5eaf6956e46_fan3%20new%20banner.webp	Fans3 empowers creators to build emotionally intelligent AI personas that engage fans 24/7	Yes	
Farcaster	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6883e31c7002016d7f174e41_fc.webp	App	Social	https://x.com/farcaster_xyz	http://farcaster.xyz/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6883e31c7002016d7f174e3e_fcb.webp	Farcaster is a decentralized social app that has an embedded wallet and mini apps that support Monad	No	
FastLane	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67d77203133e25b8b1565e04_nHQGz23P_400x400.webp	App/Infra	Dev,Tooling	https://x.com/0xFastLane	https://www.fastlane.xyz/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67bcd3c2c6d79d1cd6445d82_fastlane.webp	FastLane is an MEV protocol for validators + apps with an integrated 4337 bundler, an on-chain task scheduler, and the first holistic LST.	No	
Fiamma	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b914b9e21ffe4d10515b60_Fiamma_logo.webp	Infra	Cross-Chain	https://x.com/fiamma_labs	https://fiammalabs.io/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b914b57dbc3256a01c9255_Fiamma_banner.webp	Unlocking Bitcoin's real-world use, making it a dynamic asset &amp; foundation of a decentralized internet &amp; finance.	No	
Fizen.io	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b914c07095d061fc67bd32_Fizen.io_logo.webp	App	Payments	https://x.com/fizenapp	https://fizen.io/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b914c1779fac86351a7c11_Fizen.io_banner.webp	Backed by Tether, Fizen.io provides a Wallet-based Crypto Super App Pay for everything with crypto.	No	
Flap	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b914c8f0b471b3c1bcda4d_Flap_logo.webp	App	DeFi	https://x.com/flapdotsh	https://monad.flap.sh/board	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b914cc3a3a575251c3c907_Flap_banner.webp	Launch your coin with just one click on Monad with Flap, the premier memecoin launchpad.	No	
Flipside Crypto	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b914d748ee25af9bdf0016_Flipside%20Crypto_logo.webp	Infra	Analytics	https://x.com/flipsidecrypto	https://flipsidecrypto.com	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b914d6af1ff23f24a5b7d6_Flipside%20Crypto_banner.webp	Flipside orchestrates blockchain growth with data, science &amp; community, turning onchain insights into measurable ecosystem value.	No	
Folks Finance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b914e1d821392f193d1796_Folks%20Finance_logo.webp	App	DeFi	https://x.com/FolksFinance	https://folks.finance/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b914e01e79a03f6da50e6f_Folks%20Finance_banner.webp	Folks Finance offers cross-chain lending, borrowing, staking and trading, building the TradFi experience on a DeFi foundation.	No	
Fonbnk	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68b20be3d17aa8667581bcf4_fonbnk_logo_400x400.webp	Infra	Onramp	https://x.com/fonbnk1	https://www.fonbnk.com/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68b20d1c0eb83dc9210d08cc_fnbank%201500x500%20(1).jpeg	Fonbnk links cash-based, mobile-first economies to Web3 by converting prepaid payments into stablecoins for instant global access.	No	
Fortytwo	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b914e98f00b5fa4ab55d6d_Fortytwo_logo.webp	App/Infra	AI	https://x.com/fortytwo	https://fortytwo.network/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b914e8fc64a6c6e43a887e_Fortytwo_banner.webp	A decentralized AI network growing smarter with each node where every computer contributes to planetary-scale limitless intelligence.	Yes	
FoxWallet	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67eff2c5b61ab3ee66b95f4d_FoxWallet-logo-976d5ab2d790ac1b34faff49589007f8.webp	Infra	Wallet	https://x.com/FoxWallet	https://foxwallet.com/en	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67eff2c5b61ab3ee66b95f50_1500x500.webp	Leading multi-chain mobile and extension wallet solution that seamlessly integrates with major blockchains.	No	
GM Agents	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/687816d9af2f69162a3cf9fc_gm%20logo%20_400x400.webp	App	AI	https://x.com/GMAgents_AI	https://gmagents.ai/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/687816d6dfa57cb6f0341205_gm%20background%201500x500%20(1).webp	GM Agents is an AI super app that brings together a wide range of AI agents — for text, image, audio, and video.	No	
Garden	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68ceb77fe2afc590d7d7eb02_pink-1-.png	Infra	Cross-Chain	https://x.com/gardenfi	https://garden.finance/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68ceb77fe2afc590d7d7eb0e_monad_cover.png	Garden is a Bitcoin bridge, enabling cross-chain swaps in 30 seconds with trustless, zero-custody risk settlements for users.	No		
Gasp	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67eff2c5fe6b7047c00492d9_4MWxHMWf_400x400.webp	App	DeFi	https://x.com/Gasp_xyz	https://www.gasp.xyz/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67eff2c5fe6b7047c00492dc_1500x500.webp	Gasp is a cross-chain DEX for exchanging crypto across blockchains like Ethereum L2s, Solana, Bitcoin, RWA, and much more.	No		
Gateway	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91506e21ffe4d1051b443_Gateway_logo.webp	Infra	Privacy	https://x.com/Gateway_xyz	https://gateway.tech/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b915055075b90f1687d2bc_Gateway_banner.webp	Gateway is making encrypted data as programmable as public state, allowing for full execution over high-value data.	No	Inactive + Website NA	
Gearbox Protocol	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68f69b4cbcdd9c8e6c15073a_ISu5WSUS_400x400.webp	App	DeFi	https://x.com/GearboxProtocol	https://gearbox.fi/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68f69b4cbcdd9c8e6c15073d_1500x500.webp	Gearbox is DeFi's credit layer: permissionless lending for institutional-grade efficiency and yield.	No		
Gelato	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9150ff0b471b3c1bd3109_Gelato_logo.webp	Infra	Account,Abstraction	https://x.com/gelatonetwork	https://www.gelato.network/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91510859d08f0b8d7fccc_Gelato_banner.webp	Gelato Web3 Services bring enhanced UX to Monad's high-speed L1, enabling devs build automated apps with gasless transactions & VRF.	No		
Ghost	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91518fc64a6c6e43ab1b3_Ghost_logo.webp	Infra	Indexer	https://x.com/0xGhostLogs	https://tryghost.xyz	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9151948ee25af9bdf3ea6_Ghost_banner.webp	Build blazing fast indexers for smart contracts with Ghost: write transformations in Solidity, query data via GraphQL on hosted endpoints.	No		
Gifted.art	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91522859d08f0b8d80847_Gifted.art_logo.webp	App	NFT	https://x.com/gifteddotart	https://gifted.art/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b915216e9a2707acfaa17a_Gifted.art_banner.webp	Gifted.art is a email delivery platform.	No		
GoPlus	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9152e89130464ea40fe38_GoPlus_logo.webp	Infra	Other,Infra	https://x.com/goplussecurity	http://gopluslabs.io	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9152dab78b729a922069b_GoPlus_banner.webp	Redefining Web3 user security with its Modular User Security Layer, offering open access to security intelligence and firewall services.	No		
GoldRush by Covalent	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9153489130464ea41015c_GoldRush%20by%20Covalent_logo.webp	Infra	Indexer	https://x.com/Covalent_HQ	https://goldrush.dev/	NONE	Foundational multichain data APIs and toolkits for easy web3 development across 100+ chains including Monad.	No		
Golden Goose	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9153d6ae7e18300dfff71_Golden%20Goose_logo.webp	App	DeFi	https://x.com/GoldenGoose_app	https://www.goose.farm/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9153f6e9a2707acfac800_Golden%20Goose_banner.webp	Golden Goose is an yield-bearing game incubated by Cycle Network that combines blind boxes, nurturing gameplay and DeFi!	No		
Goldsky	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9154c5075b90f1688042c_Goldsky_logo.webp	Infra	Indexer	https://x.com/goldskyio	https://goldsky.com	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b915498330a99a870e9e79_Goldsky_banner.webp	Indexing (subgraphs with RPC failover, webhooks, and more), and streaming pipelines (replicating data to your own infra).	No		
Gorillionaire	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68474cae0b197901e1e48b23_gorillionaire%20logo.webp	App	DeFi	https://x.com/gorillionaireai	https://www.gorillionai.re/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68474cb48bed528dd7a3cec4_gorillionaire%20banner.webp	Gorillionaire transforms blockchain data chaos into clear signals. Compete on leaderboards while our intelligence guides your trades.	Yes		
HaHa Wallet	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9155dc0e02b5b7bf04716_HaHa%20Wallet_logo.webp	Infra	Account,Abstraction	https://x.com/haha_app	https://www.haha.me	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9155cf6998cf242066b95_HaHa%20Wallet_banner.webp	Native smart wallet with DeFi automations and a community rewards system.	No		
Hashflow	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91566c0e02b5b7bf04b76_Hashflow_logo.webp	App	DeFi	https://x.com/hashflow	https://app.hashflow.com/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91567cfd1b7580b46401c_Hashflow_banner.webp	Hashflow is the leading RFQ protocol that connects professional market makers and takers—powering $25B+ in volume across multiple chains.	No		
Hawk Terminal	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67e317511e6ed8599a5ea4f7_hawk%20terminal%20logo.webp	App	Gaming	https://x.com/hawkterminal_HQ	https://hawkterminal.com/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67e31755c7faf77a521f32de_hawk%20terminal%20banner.webp	Launchpad for on-chain builders augmented by AI agents.	No	Inactive + Website NA	
Hemera	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9157cf9180e8745b35b41_Hemera_logo.webp	Infra	Dev,Tooling	https://x.com/HemeraProtocol	https://thehemera.com/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9157bb126dbefee712be4_Hemera_banner.webp	Hemera is a programmable and verifiable data layer powered by the Account-Centric Indexing protocol.	No		
Henry Labs	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/687816eba60be7a1995ef6ee_henry%20logo%20.webp	App	AI	https://x.com/henrylabs	https://www.henrylabs.ai	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/687816e959d71c67e80d8968_henry%20background%201500x500%20(1).webp	Henry Labs makes it possible for apps to enable in-app shopping with a simple SDK, using agents to execute purchases.	Yes		
Hive	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/680607f2d47e9c4f91bbf907_hive.webp	App	DeFi	https://x.com/Hive_Monad	https://bhive.finance/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/680607ee5d66251ea96a2f47_hive%20banner.webp	Hive is a native stablecoin protocol on Monad, unlocking real yield, liquidity, through native-chain collateral and active deployment.	Yes	
Hyperlane	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b915848f00b5fa4ab5ff20_Hyperlane_logo.webp	Infra	Cross-Chain	https://x.com/hyperlane	https://hyperlane.xyz	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9158311a6f58966799b1e_Hyperlane_banner.webp	Hyperlane is a permissionless interoperability protocol for cross-chain message passing & asset transfers. It's fast, free, and open-source!	No		
INFINIT	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9158c48ee25af9bdfbec0_INFINIT_logo.webp	App	DeFi	https://x.com/infinit_labs	https://infinit.tech/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9158bf6998cf24206 8ccf_INFINIT_banner.webp	INFINIT is the first DeFi Abstraction Layer that enables permissionless creation of DeFi Agents to simplify on-chain transactions.	No		
IZUMi Finance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b915992a3730e911b7264c_IZUMi%20Finance_logo.webp	App	DeFi	https://x.com/izumi_Finance	https://alpha.izumi.finance/trade/swap	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91596779fac86351afd4c_IZUMi%20Finance_banner.webp	iZUMi Finance is a multi-chain DeFi protocol providing one-stop DEX-as-a-Service (DaaS).	No		
Impossible Finance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b915a173996311554d8205_Impossible%20Finance_logo.webp	App	DeFi	https://x.com/impossiblefi	https://impossible.finance/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b915a3f6998cf242069f83_Impossible%20Finance_banner.webp	A research advisory firm with a DeFi launchpad. Empowering users with top-tier opportunities.	No		
Index Network	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68d6e931940f75ea0a8764e7_Frame-777.webp	Infra	Identity	https://x.com/indexnetwork_	https://index.network/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68d6e931940f75ea0a8764e4_IndexCover.webp	The first intent graph for social interactions, a new primitive where people express what they want and AI agents deliver best matches/	Yes	
Jenius	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6883e319c7dc648610d7a0d4_jenius1.webp	App	AI	https://x.com/JeniusRndm	https://jenius.rndm.io	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68e96d207864335c4112126f_jenius%20background.webp	Tiktok x PumpFun sprinkled with AI. Users can tokenize content, graduate and join the wild ride to viral videos	Yes	
Jumper Exchange	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68fe71a6e033a4712c4c3743_Jump_-_PFP.webp	App	DeFi	https://x.com/jumperexchange	https://jumper.exchange	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68fe71a6e033a4712c4c3746_jumper-cover-image.webp	Jumper Exchange lets users swap and bridge across 50+ chains, finding the best rates from top bridges, DEXs, and liquidity sources.	No		
KINETK	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68ceb780c0d89aa11d07ec76_KINETK-Logo.webp	App	AI	https://x.com/KINETK_AI	https://www.kinetk.ai/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68ceba28a6e940587e1a4ae5_kinetk%20background.webp	Invisible watermarking, agentic AI detection & on-chain registration – building IP infrastructure for the future of digital creativity	Yes	
Kansei	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68ceb780461d68370d63b7bd_Twitter-header---13.webp	App	DeFi	https://x.com/0xKansei	https://kansei.finance/trade	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68ceb780461d68370d63b7c0_1500x500.webp	All-in-one trading superapp with near instant UX, decentralized	Yes	
KiloEx	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b915b5859d08f0b8d869df_KiloEx_logo.webp	App	DeFi	https://x.com/KiloEx_perp	https://www.kiloex.io/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b915b689130464ea416042_KiloEx_banner.webp	KiloEx is the next generation of user-friendly perpetual DEX, fully integration with LSTfi. Backed by Binance Labs.	No		
Kingdomly	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6883ea2d90ec8f542c785833_kingdom%20logo.webp	App	NFT	https://x.com/Kingdomlyapp	https://www.kingdomly.app/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6883ea3535ec43a0494e97cb_kingdom%20banner.webp	An all in one NFT Dapp, where users can launch, mint, trade, bridge, stake on Kingdomly 🏰	No		
Kintsu	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b915bf6e9a2707acfb23b7_Kintsu_logo.webp	App	DeFi	https://x.com/Kintsu	https://kintsu.xyz/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b915c0f6998cf24206bae3_Kintsu_banner.webp	Kintsu is setting a new paradigm in Liquid Staking, fully native to Monad with DAO curated Validator Registry weights.	Yes	
Kinza Finance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b915c773996311554da479_Kinza%20Finance_logo.webp	App	DeFi	https://x.com/kinzafinance	https://monad-test.kinza.finance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b915c884cbdc367d631043_Kinza%20Finance_banner.webp	Permissionless lending.	No	Sus	
Kizzy	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b915d16561ec94bfa425a1_Kizzy_logo.webp	App	Social	https://x.com/kizzymobile	https://kizzy.io/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b915d286bf1f948b421241_Kizzy_banner.webp	Kizzy is a social media betting app. Bet on how your favorite influencers and celebrities will perform on Twitter and YouTube.	Yes	
Kodeus AI	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68ceb77ff5972224015058a3_kodeus-favicon-white.webp	App	AI	https://x.com/TheKodeusLabs	https://kodeus.ai/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68ceb77ff5972224015058a6_twitter-banner.webp	Kodeus lets users build on-chain Agentic apps from prompts - powered by LLM orchestration, 4k+ tools, and IP monetization.	Yes	
Koywe	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68b20be38a9f4a238e4ca7eb_Koywe_Icon_400x400_koywe.webp	Infra	Onramp	https://x.com/koywe_latam	https://www.koywe.com/en/home	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68b20be38a9f4a238e4ca805_Banner_1500x500_koywe-1-.webp	Koywe provides crypto ramps and stablecoin financial tools: payments, billing, treasury management for businesses in LATAM.	No		
KuCoin Web3 Wallet	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b915e211a6f5896679ee94_KuCoin%20Web3%20Wallet_logo.webp	Infra	Wallet	https://x.com/KuCoin_Web3	https://www.kucoin.com/download	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b915e4ab78b729a9227ef1_KuCoin%20Web3%20Wallet_banner.webp	The KuCoin Web3 Wallet is a decentralized, self-custodial wallet for easy on-chain asset management.	No		
Kuru	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b915ece21ffe4d105246dd_Kuru_logo.webp	App	DeFi	https://x.com/KuruExchange	https://kuru.io/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b915ee1610ca8a55c3bd46_Kuru_banner.webp	Find, trade and launch your coins on a fully on-chain CLOB. Built for traders, powered by Monad.	Yes	
LAGOON	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/687546f428ab754a943f12cb_Logo_LAGOON_400x400-pixels.webp	App	DeFi	https://x.com/lagoon_finance	https://lagoon.finance/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/687546f428ab754a943f12c8_Banner-Cover_LAGOON_1500x500-pixels.webp	LAGOON is an EVM-based vault infrastructure for curators, turning sophisticated farming strategies into 1-click yield products.	No		
LEVR.bet	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b915f9779fac86351bf0bccc_LFJ_logo.webp	App	DeFi	https://x.com/levr_bet	http://levr.bet/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b915fa9fa4892d6236d66a_LEVR.bet_banner.webp	Leverage Sports Betting with Fully Liquid Positions.	Yes	
LFJ	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91601c0e02b5b7bf0bccc_LFJ_logo.webp	App	DeFi	https://x.com/LFJ_gg	https://pandaria.lfj.gg/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b916025d51b1bcd91c3c36_LFJ_banner.webp	The onchain trading platform built for winners. One-stop DEX, Aggregator & Screener for Monad. Discover & buy every token at the best prices.	No		
LI.FI	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68ceb780e6d195deeeed6da7_lifi_pfp.webp	Infra	Cross-Chain	https://x.com/lifiprotocol	https://li.fi/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68ceb780e6d195deeeed6da4_lifi_background.webp	One API for seamless swaps & bridging across EVM, Solana and Bitcoin. Integrated by Robinhood Wallet, MetaMask, Phantom + 600 partners.	No		
LayerZero	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9160a6561ec94bfa44b63_LayerZero_logo.webp	Infra	Cross-Chain	https://x.com/LayerZero_Core	https://layerzero.network/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9160b3a3a575251c4a40a_LayerZero_banner.webp	LayerZero is an omnichain interoperability protocol that enables seamless communication between different blockchains.	No	
Layerhub	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68f69b4cc576152375cc74ac_group_1000002444_1x.webp	Infra	Analytics	https://x.com/layerhub	https://layerhub.xyz/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68f69b4cc576152375cc74af_image_156.webp	LayerHub is an on-chain analytics platform offering dashboards, wallet insights, leaderboards, and ecosystem tracking tools.	No		
Leap Wallet	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91613d821392f193e089c_Leap%20Wallet_logo.webp	Infra	Account,Abstraction	https://x.com/leap_wallet	https://www.leapwallet.io/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91615859d08f0b8d8af34_Leap%20Wallet_banner.webp	Leap is a multi-chain wallet spanning across EVM, Cosmos & Bitcoin.	No		
Legends of Elysium	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6802d4ad83a262e9bc52444f_zejJW5VI_400x400.webp	App	Gaming	https://x.com/LegendsElysium	https://legendsofelysium.io/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6802d455ad9e71e887275dc8_Monad1500x500.webp	A fantasy strategy game that combines TCG and board game mechanics. Collect cards, build custom decks, and engage in tactical battles.	No		
LeverUp	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68fe71a6e79a1b8bcd68fa36_logo-400x400.webp	App	DeFi	https://x.com/LeverUp_xyz	https://leverup.xyz/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68fe71a6e79a1b8bcd68fa33_background-1500x500.webp	Next-gen perps DEX with LP-free trading, deep liquidity, and up to 1001x leverage.	Yes	
Likwid	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6863141eff21aa78233f7caa_liqd%20logo%20.webp	App	DeFi	https://x.com/likwid_fi	https://likwid.fi/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68631425dbb476f319b06489_liqd%20banner.webp	The first fully permissionless, oracle-less, margin trading protocol based on uniswap V4.	No		
Lombard	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b916363a3a575251c4ba9c_Lombard_logo.webp	Infra	Other,Infra	https://x.com/Lombard_Finance	https://lombard.finance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b916331610ca8a55c3ed8f_Lombard_banner.webp	Lombard connects Bitcoin to every chain, defi protocol, and yield opportunity via LBTC. LBTC currently has $1.9B+ in deposits.	No	
LootGO	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9163ce0429ca00f50873e_LootGO_logo.webp	App	Gaming	https://x.com/lootgo_official	https://lootgo.app	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9163e89130464ea41cda8_LootGO_banner.webp	LootGO is a free walk-to-earn mobile app turning your daily life into a treasure hunt for next 100x memecoins.	No	
Lootify	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67bebc5c47f06f070fbb11bd_lootify.webp	App	Gaming	https://x.com/Lootify_xyz	https://beta.lootify.xyz/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67bebc5fc3129d45e63750cf_lootify%20b.webp	Lootify is a lootbox platform on Monad, offering NFTs, gaming assets, and tokenized trading cards as rewards.	Yes	
Lumiterra	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/689f814d36a7d97c9a6b7bd8_logo.webp	App	AI	https://x.com/LumiterraGame	https://lumiterra.net	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/689f814d36a7d97c9a6b7bdb_background.webp	Lumiterra is the first agentic interactive multiplayer sandbox	No		
M0narch	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6883e31a85ccb6f309a67727_4-01.webp	App	Betting	https://x.com/MonadM0narch	https://m0narch.xyz	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6883e31a85ccb6f309a67734_1500500.webp	Provably fair iGaming platform on Monad - every wager, outcome, and payout is secured on-chain.	Yes
MERV	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9164ba00e125f94a0513b_MERV_logo.webp	App	AI	https://x.com/merv_wtf	https://merv.wtf/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9164611a6f589667a3393_MERV_banner.webp	IP creation platform powered by AI.	No
Mace	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91d8d9fa4892d623b8b8a_mace%20logo.webp	App	DeFi	https://x.com/mace_ag	https://www.mace.ag/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91d8ef9180e8745b830a4_mace%20banner.webp	Mace is a DEX aggregator on Monad that optimizes trades by routing through AMMs, orderbooks &amp; RFQ market makers for best execution.	Yes
Mach Exchange	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67cb75a3f18868e403582598_Mach-400x400.webp	App	DeFi	https://x.com/mach_exchange	https://mach.exchange	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67cb75a3f18868e40358259b_1500x500-1-.jpeg	Mach Exchange is a one click onboarding tool, allowing any users to instantly and securely onboard from any crypto asset on any chain.	No
Madhouse	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68474447f8592a42601ad218_Madhouse_PFP_400x400.webp	App	DeFi	https://x.com/usemadhouse	https://madhouse.ag/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68474447f8592a42601ad214_Madhouse_Ecosystem_1500x500.webp	Madhouse is a DEX aggregator on Monad that finds the best swap rates by routing trades across all major liquidity sources.	Yes
Magic Eden	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9165fb9188e59b9a6f675_Magic%20Eden_logo.webp	App	NFT	https://x.com/magiceden	https://magiceden.io/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9165d7095d061fc68eef0_Magic%20Eden_banner.webp	Magic Eden brings all chains and all assets together in one easy-to-use platform.	No
Magma	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9166595f6c765132080f7_Magma_logo.webp	App	DeFi	https://x.com/MagmaStaking	https://www.magmastaking.xyz/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b916666b6cb4307d54557e_Magma_banner.webp	Magma is a Liquid Staking Protocol building the first Distributed Validator on Monad and developing MEV to reduce latency by up to 4x.	Yes
Mahjong123	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9166ed821392f193e4fd5_Mahjong123_logo.webp	App	Gaming	https://x.com/0xMJM	https://monad.mahjong123.io/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9166f048c532f61e000cd_Mahjong123_banner.webp	Match tiles, progress through levels, boost your ranking, and get more airdrop rewards!	No
Memesteroid	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68f69b4d753f1c7638402824_logo-eco.webp	App	DeFi	https://x.com/memesteroid	https://memesteroid.fun	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68f69b4d753f1c7638402828_banner1500x500-eco.webp	Memesteroid powers the full lifecycle of memecoins with prediction markets and perps from viral launch to maturity.	Yes
Mentaport	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67eff2c59473541e98a5deb4_mentaport-logo.webp	Infra	Identity	https://x.com/mentaportinc	https://www.mentaport.com	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67eff2c59473541e98a5dea9_mentaport-landing-page.webp	Keep your creative works safe from the internet troublemakers.	No
Meow Finance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6883e31d5763deb46e176906_MeowFi-Logo-400x400-black-1-.webp	App	DeFi	https://x.com/meowfi_	https://meowfi.xyz/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6883e31d5763deb46e176909_MeowFi_Banner.webp	The most capital and time-efficient liquidity infrastructure built to unlock additional layers of liquidity.	Yes
Meta Leap	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9167a9fa4892d62373abc_Meta%20Leap_logo.webp	App	Gaming	https://x.com/MetaLeap_io	https://metaleap.io/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9167d9fa4892d62373cf7_Meta%20Leap_banner.webp	Meta Leap is a plug-and-play AI Gaming solution that empowers developers to seamlessly onboard their Web2 games onto Web3 within 30 minutes.	No
MetaKeep	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b916858330a99a870f5bdc_MetaKeep_logo.webp	Infra	Account,Abstraction	https://x.com/metakeep	https://metakeep.xyz	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9168583477f8bd77c78e8_MetaKeep_banner.webp	Onboard 300x more users in 1 API call, 5 mins. The #1 self-custody infra for users &amp; AI is now on Monad—built by ex-GOOG, MSFT, X, META.	No
Mflo	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68d6e931832086d684a61615_Mflo_logo_400x.webp	App	Payments	https://x.com/mfloai	https://mflo.ai	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68d6e931832086d684a61612_Mflo_background_1500x500.webp	The Data Kernel for AI agents - by MCP and x402, enabling on-demand access across any datasets.	No
MindAgentsAI	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68e96f51ceca150235bab079_IMG_8830.jpeg	App	AI	https://x.com/MindAgentsAI	http://mindagents.net/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68e96f50ceca150235bab075_IMG_8831.jpeg	Dual-purpose platform: AI Agent Marketplace and a Decentralized Launchpad	Yes
Mintpad	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9168df6998cf242076fa0_Mintpad_logo.webp	App	NFT	https://x.com/mintpadco	https://mintpad.co/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9168e6561ec94bfa4998f_Mintpad_banner.webp	Mintpad makes it easy to start an NFT collection. All creators need is their artwork and a cryptocurrency wallet.	No
Mobula	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9169686bf1f948b427b62_Mobula_logo.webp	Infra	Indexer	https://x.com/Mobulaio	https://mobula.io	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91697023891683685853e_Mobula_banner.webp	Mobula provides Data APIs for dApps, blockchain analytics for foundations and warehousing for builders.	No
MonadExplorer by BlockVision	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b916a989130464ea421461_MonadExplorer%20by%20BlockVision_logo.webp	Infra	Analytics	https://x.com/blockvisionhq	https://monadexplorer.com/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b916ab89130464ea4215e4_MonadExplorer%20by%20BlockVision_banner.webp	MonadExplorer is a block explorer built by BlockVision. It helps users analyze transactions, contracts, and network activity on Monad.	Yes
Monadata AI	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b916ba84cbdc367d63b09c_Monadata%20AI_logo.webp	App	AI	https://x.com/monadata_ai	https://monadata.ai/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b916bcb126dbefee7211ec_Monadata%20AI_banner.webp	Monadata is an AI and Data Platform on Monad. Interact, Train, and Earn!	Yes
Monday Trade	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6834a164bf63f433352200ac_logo400x400.webp	App	DeFi	https://x.com/MondayTrade_	https://monday.trade/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6834a164bf63f433352200af_twitter.webp	Monday Trade is Monad's native spot DEX combining the precision of a fully on-chain order book with the simplicity of AMMs.	No
Monorail	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9170173996311554e7bc6_Monorail_logo.webp	App	DeFi	https://x.com/monorail_xyz	https://monorail.xyz	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91702be2243a8e820b2af_Monorail_banner.webp	Trade anything across Monad. Monorail is the first aggregator to combine onchain orderbooks and AMMs to give you the best trade possible.	Yes
Morpheus	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6863135aaa23b039d89be2e6_logo-full-k.webp	App	DeFi	https://x.com/Morpheus_Farm	https://morpheus.farm	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6863135baa23b039d89be31e_banner.webp	Launch a token, trade, and market-make in one step with Morpheus - a Monad-based DEX using CMM and Wormhole NTT for cross-chain flow.	Yes
Moseiki	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9170ba00e125f94a0c562_Moseiki_logo.webp	App	Social	https://x.com/MoseikiApp	https://moseiki.app/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9170caf1ff23f24a7847b_Moseiki_banner.webp	Moseiki is Web3 Social Networking Application that merges the familiar experience of Web2 with the financial power of blockchain.	No
Mozi	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91713c0e02b5b7bf17fa6_Mozi_logo.webp	App/Infra	Social	https://x.com/mozifinance	https://mozi.finance/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91714f454824cadfc031c_Mozi_banner.webp	MOZI is a next-generation social trading platform built on Monad, it combines a Web Wallet with powerful social trading tools.	Yes
Mu Digital	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b917246e9a2707acfc32e2_Mu%20Digital_logo.webp	App	DeFi	https://x.com/MuDigitalHQ	https://mudigital.net/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91725c0e02b5b7bf189e3_Mu%20Digital_banner.webp	RWA protocol bringing Asia's Best Yields Onchain.	Yes
Multipli.fi	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91733859d08f0b8d98cf6_Multipli.fi_logo.webp	App	DeFi	https://x.com/multiplifi	https://multipli.fi/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91735e21ffe4d10532ad6_Multipli.fi_banner.webp	Multipli is a Zk based yield protocol specifically designed for making yield on traditionally non-yield bearing assets.	No
Multisynq	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6878165ed21cf891079ce3c7_multisynq%20logo%20kxXecY0r_400x400.webp	App/Infra	DePIN	https://x.com/multisynq	https://multisynq.io/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/687816619e7ebd9c2ba23da0_multisynq%20banner%201500x500%20(1).webp	The first shared, real-time application layer of the internet. A decentralized network where every app is multiplayer by default.	Yes
NADSA	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68b20be49797d18c63a72c2f_nadsa-logo.webp	App	DeFi	https://x.com/0xNADSA	https://nadsa.space	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68b20be49797d18c63a72c2c_nadsa-banner.webp	NADSA is the purpose-built command center for seamless exploration on Monad.	Yes
NFTs2Me	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b917409fa4892d6237dc33_NFTs2Me_logo.webp	App	NFT	https://x.com/NFTs2Me	http://nfts2me.com/app/monad-testnet/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91741ab78b729a9235c7d_NFTs2Me_banner.webp	NFTs2Me is a user-friendly comprehensive platform to create, deploy and manage your NFT collection on Monad, 100% free.	No
NXTchain	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68f69b4c2914de7af9a367b0_NXTchain_Monad_LOGO.webp	App	DePIN	https://x.com/NXT_chain	https://www.nxtchain.com	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68f69b4c2914de7af9a367b3_NXTchain_Monad_BG.webp	NXTchain empowers anyone to join the decentralized cloud through plug-and-play devices or data center ownership.	Yes
Nabla Finance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9174a6ae7e18300e1b1b2_Nabla%20Finance_logo.webp	App	DeFi	https://x.com/nablafi	https://www.nabla.fi	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9174b8f00b5fa4ab712b3_Nabla%20Finance_banner.webp	Nabla Finance is a yield protocol where the yield is generated by the hyper-efficient Nabla AMM.	No
Nad.fun	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91753fc64a6c6e43c16e3_Nad.fun_logo.webp	App	DeFi	https://x.com/naddotfun	https://testnet.nad.fun	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91754f9180e8745b48efe_Nad.fun_banner.webp	Nad.fun is a Social Memecoin Playground powered by Monad, enabling seamless token launches and trading.	Yes
NadSmith	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9175d84cbdc367d64277c_NadSmith_logo.webp	App	AI	https://x.com/NadSmith_	https://nadsmith.ai/	NONE	AI Agent OS on Monad | Tokenizing Agents &amp; Automating Markets - built exclusively on Monad.	Yes
Narrative	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68965da65527ff3384f1c059_narrative%206R7oJYe6_400x400.webp	App	DeFi	https://x.com/narrativexyz	https://www.testnet.narrative.xyz/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68965d4424485e6a8ec2d656_8.6.webp	Perpetual information markets	Yes
Narwhal Finance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9176689130464ea4285d6_Narwhal%20Finance_logo.webp	App	DeFi	https://x.com/Narwhal_Finance	https://testnet.narwhal.finance/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b91765b126dbefee72cdc5_Narwhal%20Finance_banner.webp	Narwhal Finance is an AI-driven decentralized perpetual trading platform exclusively on Monad. Backed by Jump Crypto and CMS Holdings.	Yes
Neverland	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68d6e9319f6a7484c5ec014c_nvr_logo.webp	App	DeFi	https://x.com/neverland_money	https://neverland.money	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68d6e9319f6a7484c5ec0149_1500x500.webp	Neverland is a Monad-native lending protocol blending Aave V3 security with novel veTokenomics, self-repaying loans &amp; yield strategies.	Yes
Nillion	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9177f779fac86351cf9da_Nillion_logo.webp	Infra	AI	https://x.com/nillion	http://www.nillion.com	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9177ed052009891787b62_Nillion_banner.webp	Humanity's first blind computer. The internet's base layer for all private data.	No
Nitro by Router Protocol	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9178c02389168368647c9_Nitro%20by%20Router%20Protocol_logo.webp	Infra	Cross-Chain	https://x.com/routerprotocol	https://app.routernitro.com/swap	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9178df6998cf24208281a_Nitro%20by%20Router%20Protocol_banner.webp	Nitro is an intent-based bridge, provides fast, cheap bridges and swaps between 30+ chains	No
NitroFinance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b917961e79a03f6da6f980_NitroFinance_logo.webp	App	DeFi	https://x.com/NitroFinance	https://nitrofinance.xyz/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9179789130464ea42be06_NitroFinance_banner.webp	NitroFinance: An AMM on steroids—fusing DEX and Money Market into one pool to maximize efficiency and simplify liquidity management.	Yes
Nomas Wallet	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b917a1f0b471b3c1becebb_Nomas%20Wallet_logo.webp	Infra	Account,Abstraction	https://x.com/NomasWalletReal	https://nomaswallet.com/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9179f5d51b1bcd91d4149_Nomas%20Wallet_banner.webp	Reinvent the Web3 experience. Powered by AI.	No
Nostra	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b917a7f454824cadfc6ab1_Nostra_logo.webp	App	DeFi	https://x.com/nostrafinance	https://monad.nostra.finance/lend-borrow	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b917a995f6c7651321abbc_Nostra_banner.webp	Nostra is the crypto Super App where users can lend, borrow, swap and bridge cryptocurrencies.	No
Notifi	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b917b1d9acff4898218bb3_Notifi_logo.webp	Infra	Dev,Tooling	https://x.com/NotifiNetwork	https://notifi.network/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b917b25075b90f1689eb7e_Notifi_banner.webp	Real-time, white-labeled alerts for on/off-chain events (loan health, liquidity, etc.) in DeFi via email, Telegram, Discord, &amp; more.	No
Noves	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6883e31a3cf8aec80270f6e0_noves-logo.webp	Infra	Dev,Tooling	https://x.com/noves_fi	https://noves.fi	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6883e31a3cf8aec80270f6e3_noves-banner.webp	With Noves, users can get financial-grade onchain data on Monad: clean, reconciled, and standardized, for tax, accounting, and finance.	No
Nubila	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68e035995a5f630974e62baa_nubila_logo_400-400.webp	App	AI	https://x.com/nubilanetwork	https://nubila.ai/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68e035995a5f630974e62bad_1500x500.webp	Nubila is building the physical perception layer for the autonomous economy and AI.	No
Nunchi	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68ceb77f687b9b48c01abe3c_nunchi_logo_400x400.webp	App	DeFi	https://x.com/nunchi	https://nunchi.trade/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68ceb77f687b9b48c01abe3f_nunchi_1500x500.webp	A perpetuals exchange for the invisible currents of finance. Long or short any yield. Sense the unsaid. Trade the unseen.	No
OKX Explorer	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b917bcd9acff4898219311_OKX%20Explorer_logo.webp	Infra	Analytics	https://x.com/okxexplorer	https://www.okx.com/web3/explorer	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b917bef6998cf242083de7_OKX%20Explorer_banner.webp	All-In-One blockchain explorer, supporting 60+ blockchains, with OpenAPI and EaaS to securely explore and build onchain.	No
OKX Wallet	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b917c5d052009891789dd4_OKX%20Wallet_logo.webp	Infra	Wallet	https://x.com/wallet	https://www.okx.com/web3	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b917c873996311554ef5ae_OKX%20Wallet_banner.webp	OKX Wallet is your all-in-one gateway to the Web3 world.	No
OSL Pay	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68fe71a61a4eecacc687e166_D_h84D3s_400x400.webp	Infra	Onramp	https://x.com/oslpay	https://www.osl-pay.com/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/68fe71a61a4eecacc687e171_1500x500-2.webp	OSL Pay, the licensed payments arm of OSL Group, delivers secure, compliant digital-to-fiat conversion for global clients.	No
OctoSwap	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67ce4ceb5a19b9c6f4206ffa_octoswap%20logo.webp	App	DeFi	https://x.com/octoswapdex	https://octo.exchange	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67ce4cf1eb2c11cb1c3b90bc_octoswap.webp	OctoSwap offers lightning-fast token swaps and capital-efficient liquidity pools with a user friendly interface.	Yes
Omnia	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6878162dca7c1699923aaaba_omnia_400x400.webp	App	NFT	https://x.com/ExploreOmnia	https://www.omnia.lol/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/6878162f2e58f4023f2fae19_omnia%20background%201500x500%20(1).webp	Omnia is a pet battle and adventure game, built by the Sappy Seals team.	Yes
Opals	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b917cf048c532f61e10d6c_Opals_logo.webp	App	Social	https://x.com/Opals_io	https://opals.io/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b917d1e882d110b44cba74_Opals_banner.webp	Opals: Kickstarter meets NFTs for projects. Buy cards → auto-launch when funded → cards claim tokens + rewards. Discover gems.	Yes

`

const parseTSVData = (tsv: string) => {
  const lines = tsv.trim().split("\n").slice(1)
  return lines
    .map((line) => {
      const [name, logo, category, tags, twitter, website, banner, description] = line.split("\t")
      return {
        name: name?.trim() || "",
        logo: logo?.trim() || "",
        category: category?.trim() || "",
        tags:
          tags
            ?.split(",")
            .map((t) => t.trim())
            .filter(Boolean) || [],
        twitter: twitter?.trim() || "",
        website: website?.trim() || "",
        banner: banner?.trim() || "",
        description: description?.trim() || "",
      }
    })
    .filter((p) => p.name)
}

const rawProjectData = parseTSVData(rawTSVData)

const totalSpheres = 304
const emptySpheres = totalSpheres - rawProjectData.length

const allSpheres = [
  ...rawProjectData.map((project, index) => ({
    ...project,
    isEmpty: false,
    index,
  })),
  ...Array.from({ length: emptySpheres }, (_, i) => ({
    name: "",
    logo: "",
    category: "",
    tags: [],
    twitter: "",
    website: "",
    banner: "",
    description: "",
    isEmpty: true,
    index: rawProjectData.length + i,
  })),
]

const projectData = allSpheres.map((item, index) => {
  const totalProjects = allSpheres.length
  const phi = Math.acos(-1 + (2 * index) / totalProjects)
  const theta = Math.sqrt(totalProjects * Math.PI) * phi
  const radius = 12

  return {
    ...item,
    position: [
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi),
    ] as [number, number, number],
  }
})

export function MainScene({ walletAddress }: { walletAddress: string | null }) {
  const [selectedProject, setSelectedProject] = useState<(typeof projectData)[0] | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [showCategories, setShowCategories] = useState(false)
  const [exp, setExp] = useState(0)
  const [maxExp] = useState(100)
  const [discoveredDapps, setDiscoveredDapps] = useState<Set<number>>(new Set())
  const [canMint, setCanMint] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (walletAddress) {
      const savedData = localStorage.getItem(`monad_exp_${walletAddress}`)
      if (savedData) {
        const { exp: savedExp, discovered } = JSON.parse(savedData)
        setExp(savedExp || 0)
        setDiscoveredDapps(new Set(discovered || []))
      }
    }
  }, [walletAddress])

  useEffect(() => {
    if (walletAddress && (exp > 0 || discoveredDapps.size > 0)) {
      const dataToSave = {
        exp,
        discovered: Array.from(discoveredDapps),
      }
      // </CHANGE> Fixed typo from JSON.JSON.stringify to JSON.stringify
      localStorage.setItem(`monad_exp_${walletAddress}`, JSON.stringify(dataToSave))
    }
  }, [exp, discoveredDapps, walletAddress])

  useEffect(() => {
    setCanMint(exp >= 100)
  }, [exp])

  const filteredProjects = useMemo(() => {
    if (!activeTag) return projectData
    return projectData.filter((project) => !project.isEmpty && project.tags.some((tag) => tag === activeTag))
  }, [activeTag])

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    projectData.forEach((project) => {
      if (!project.isEmpty) {
        project.tags.forEach((tag) => tagSet.add(tag))
      }
    })
    return Array.from(tagSet).sort()
  }, [])

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    projectData.forEach((project) => {
      if (!project.isEmpty) {
        project.tags.forEach((tag) => {
          counts[tag] = (counts[tag] || 0) + 1
        })
      }
    })
    return counts
  }, [])

  const handleSphereClick = (project: (typeof projectData)[0]) => {
    if (project.isEmpty) {
      // Empty sphere - decrease EXP
      setExp((prev) => Math.max(0, prev - 5))
    } else {
      // Dapp sphere - increase EXP if not already discovered and show info
      if (!discoveredDapps.has(project.index)) {
        setDiscoveredDapps((prev) => new Set(prev).add(project.index))
        setExp((prev) => Math.min(maxExp, prev + 5))
      }
      setSelectedProject(project)
    }
  }

  const handleMintNFT = async () => {
    if (!walletAddress || !canMint) return

    try {
      console.log("[v0] Starting NFT claim...")

      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask or Web3 wallet is not installed")
      }

      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      // Check network
      const network = await provider.getNetwork()
      const expectedChainId = 10143n // Monad Testnet
      if (network.chainId !== expectedChainId) {
        throw new Error(`Please switch to Monad Testnet (Chain ID: ${expectedChainId})`)
      }

      // Check balance
      const balance = await provider.getBalance(walletAddress)
      const minRequired = ethers.parseEther("1.1") // 1 MON + gas buffer
      if (balance < minRequired) {
        throw new Error(`Insufficient balance. You need at least ${ethers.formatEther(minRequired)} MON (1 MON for NFT + gas fees)`)
      }

      const contractABI = [
        {
          inputs: [
            { internalType: "address", name: "_receiver", type: "address" },
            { internalType: "uint256", name: "_quantity", type: "uint256" },
            { internalType: "address", name: "_currency", type: "address" },
            { internalType: "uint256", name: "_pricePerToken", type: "uint256" },
            {
              components: [
                { internalType: "bytes32[]", name: "proof", type: "bytes32[]" },
                { internalType: "uint256", name: "quantityLimitPerWallet", type: "uint256" },
                { internalType: "uint256", name: "pricePerToken", type: "uint256" },
                { internalType: "address", name: "currency", type: "address" },
              ],
              internalType: "struct IDrop.AllowlistProof",
              name: "_allowlistProof",
              type: "tuple",
            },
            { internalType: "bytes", name: "_data", type: "bytes" },
          ],
          name: "claim",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
      ]

      const nftContract = new ethers.Contract("0x084BC6E29466fCd060Ff4c17Dc7B1EbB65171742", contractABI, signer)

      console.log("[v0] Preparing claim parameters...")
      alert("Preparing to claim your achievement NFT...")

      // Parameters for claiming (ERC721 Drop without tokenId)
      const receiver = walletAddress
      const quantity = 1 // Mint 1 NFT
      const currency = "0x0000000000000000000000000000000000000000" // Native token (MON)
      const pricePerToken = ethers.parseEther("1") // 1 MON
      
      // For public claims, allowlistProof should match the claim parameters
      const allowlistProof = {
        proof: [],
        quantityLimitPerWallet: 0, // 0 means no limit for public claims
        pricePerToken: pricePerToken, // Must match the actual pricePerToken
        currency: currency, // Must match the actual currency
      }
      const data = "0x"

      // Calculate total value to send
      const totalValue = pricePerToken * BigInt(quantity)

      console.log("[v0] Claiming with parameters:", {
        receiver,
        quantity,
        value: ethers.formatEther(totalValue),
        pricePerToken: ethers.formatEther(pricePerToken),
        currency,
      })

      // Estimate gas first
      let gasEstimate
      try {
        gasEstimate = await nftContract.claim.estimateGas(
          receiver,
          quantity,
          currency,
          pricePerToken,
          allowlistProof,
          data,
          { value: totalValue }
        )
        console.log("[v0] Gas estimate:", gasEstimate.toString())
      } catch (estimateError: any) {
        console.error("[v0] Gas estimation failed:", estimateError)
        // If estimation fails, try to extract revert reason
        if (estimateError.data) {
          throw new Error(`Transaction would fail: ${estimateError.reason || "Unknown error"}`)
        }
        throw new Error("Failed to estimate gas. The transaction would likely fail.")
      }

      // Add 20% buffer to gas estimate
      const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100)

      const tx = await nftContract.claim(receiver, quantity, currency, pricePerToken, allowlistProof, data, {
        value: totalValue,
        gasLimit: gasLimit,
      })

      console.log("[v0] Transaction sent:", tx.hash)
      alert("Claiming... Please wait for confirmation.")

      const receipt = await tx.wait()

      // Check transaction status
      if (receipt.status === 0) {
        throw new Error("Transaction reverted. Please check if you have sufficient funds and meet all claim conditions.")
      }

      console.log("[v0] NFT claimed successfully!")
      alert("NFT claimed successfully! 🎉")

      // Reset EXP after successful claim
      setExp(0)
      setDiscoveredDapps(new Set())

      // Save reset state
      if (walletAddress) {
        const dataToSave = {
          exp: 0,
          discovered: [],
        }
        localStorage.setItem(`monad_exp_${walletAddress}`, JSON.stringify(dataToSave))
      }
    } catch (error: any) {
      console.error("Claiming failed:", error)

      let errorMessage = "Unable to claim NFT.\n\n"

      // Extract error message from various error types
      if (error.reason) {
        errorMessage = `Transaction failed: ${error.reason}`
      } else if (error.message) {
        if (error.message.includes("user rejected") || error.message.includes("User rejected")) {
          errorMessage = "Transaction was cancelled."
        } else if (error.message.includes("insufficient funds") || error.message.includes("Insufficient balance")) {
          errorMessage = error.message
        } else if (error.message.includes("execution reverted") || error.message.includes("Transaction would fail") || error.message.includes("Transaction reverted")) {
          errorMessage = error.message + "\n\nPossible reasons:\n• Not enough MON (need 1 MON + gas fees)\n• Claim conditions not met\n• Already claimed maximum allowed\n• Contract is paused"
        } else if (error.message.includes("Chain ID")) {
          errorMessage = error.message
        } else {
          errorMessage += error.message
        }
      } else if (error.data?.message) {
        errorMessage += error.data.message
      } else {
        errorMessage += "Unknown error occurred. Please check the console for details."
      }

      alert(`Claiming failed:\n\n${errorMessage}`)
    }
  }

  return (
    <>
      {walletAddress && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40">
          <div className="relative w-16 h-[28rem] bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 backdrop-blur-xl rounded-3xl border-2 border-purple-500/40 overflow-hidden shadow-2xl shadow-purple-500/30">
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 via-transparent to-purple-600/20 animate-pulse" />

            {/* Progress bar fill */}
            <div
              className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out"
              style={{ height: `${(exp / maxExp) * 100}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600 via-purple-500 to-purple-400">
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/30 animate-pulse" />
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
              </div>
            </div>

            {/* Level indicators */}
            <div className="absolute inset-0 flex flex-col justify-between py-4">
              {[100, 75, 50, 25, 0].map((level) => (
                <div key={level} className="relative px-2">
                  <div className={`h-0.5 w-full ${exp >= level ? "bg-purple-300" : "bg-zinc-700/50"}`} />
                  <span className="absolute -right-12 -top-2 text-[10px] font-bold text-zinc-500">{level}</span>
                </div>
              ))}
            </div>

            {/* EXP Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="bg-gradient-to-br from-zinc-900/95 to-zinc-950/95 px-4 py-3 rounded-2xl backdrop-blur-md border border-purple-500/30 shadow-xl">
                <div className="text-center space-y-1">
                  <div className="text-xs font-bold text-purple-400 tracking-wider">EXP</div>
                  <div className="text-2xl font-black bg-gradient-to-br from-white to-purple-300 bg-clip-text text-transparent">
                    {exp}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-semibold">/ {maxExp}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Discovered Dapps Counter */}
          <div className="mt-6 bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 backdrop-blur-xl rounded-2xl px-4 py-4 border-2 border-purple-500/40 shadow-2xl shadow-purple-500/30">
            <div className="text-center space-y-2">
              <div className="text-xs text-purple-400 font-bold tracking-wider">FOUND</div>
              <div className="text-3xl font-black bg-gradient-to-br from-white to-purple-300 bg-clip-text text-transparent">
                {discoveredDapps.size}
              </div>
              <div className="text-[10px] text-zinc-500 font-semibold">/ {rawProjectData.length}</div>
              {/* Progress ring */}
              <div className="relative w-12 h-12 mx-auto mt-2">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-zinc-800"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - discoveredDapps.size / rawProjectData.length)}`}
                    className="text-purple-500 transition-all duration-700"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-purple-400">
                  {Math.round((discoveredDapps.size / rawProjectData.length) * 100)}%
                </div>
              </div>
            </div>
          </div>

          {canMint && (
            <button
              onClick={handleMintNFT}
              className="mt-6 w-full bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 backdrop-blur-xl rounded-2xl px-4 py-4 border-2 border-purple-500/40 shadow-2xl shadow-purple-500/30 transition-all duration-300 hover:scale-105 animate-pulse"
            >
              <div className="text-center space-y-2">
                <div className="text-xs text-white font-bold tracking-wider">MINT NFT</div>
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2-JnbsoYMBedSqzCknfoFqOHfKuqJpqK.png"
                  alt="Moncore NFT"
                  className="w-20 h-20 mx-auto rounded-lg object-cover"
                />
              </div>
            </button>
          )}
        </div>
      )}

      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <color attach="background" args={["#050505"]} />
        <fog attach="fog" args={["#050505", 10, 50]} />
        <ambientLight intensity={0.2} />
        <Environment preset="city" />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          rotateSpeed={0.3}
          autoRotate
          autoRotateSpeed={0.15}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
          minDistance={10}
          maxDistance={40}
        />

        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
          <Logo position={[0, 0, 0]} />
        </Float>

        <GridPoints />
        <FloatingParticles />
        <DataFlowLines />

        {filteredProjects.map((project, index) => (
          <InteractivePoint
            key={index}
            project={project}
            onClick={() => handleSphereClick(project)}
            isSelected={selectedProject?.name === project.name}
            isDiscovered={discoveredDapps.has(project.index)}
          />
        ))}
      </Canvas>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-[95vw] px-4">
        {!showCategories ? (
          <button
            onClick={() => setShowCategories(true)}
            className="mx-auto block px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 backdrop-blur-xl text-white text-base font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-purple-500/20 border border-purple-500/30"
          >
            Categories ({filteredProjects.length})
          </button>
        ) : (
          <div className="relative backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-purple-500/5 animate-pulse" />

            <div className="relative p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                  Categories
                </h3>
                <button
                  onClick={() => setShowCategories(false)}
                  className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2 mb-3">
                <button
                  onClick={() => setActiveTag(null)}
                  className={`group relative px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                    activeTag === null
                      ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30"
                      : "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 hover:text-white"
                  }`}
                >
                  <span className="relative z-10">All</span>
                  <span className="absolute bottom-0.5 right-0.5 text-[10px] opacity-70">{projectData.length}</span>
                  {activeTag === null && (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent rounded-lg animate-pulse" />
                  )}
                </button>

                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`group relative px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                      activeTag === tag
                        ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30"
                        : "bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700/50 hover:text-white"
                    }`}
                  >
                    <span className="relative z-10">{tag}</span>
                    <span className="absolute bottom-0.5 right-0.5 text-[10px] opacity-70">{tagCounts[tag] || 0}</span>
                    {activeTag === tag && (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent rounded-lg animate-pulse" />
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => router.push("/projects")}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
              >
                <span>View All Projects</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl mx-4 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="relative h-48 overflow-hidden">
              <img
                src={selectedProject.banner || "/placeholder.svg"}
                alt={selectedProject.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedProject.logo || "/placeholder.svg"}
                  alt={selectedProject.name}
                  className="w-16 h-16 rounded-xl object-cover bg-zinc-800"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">{selectedProject.name}</h2>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">
                      {selectedProject.category}
                    </span>
                    {selectedProject.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 text-xs rounded-full bg-zinc-800 text-zinc-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-zinc-300 leading-relaxed">{selectedProject.description}</p>

              <div className="flex gap-3 pt-2">
                <a
                  href={selectedProject.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-center"
                >
                  Visit Website
                </a>
                <a
                  href={selectedProject.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
                >
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function InteractivePoint({
  project,
  onClick,
  isSelected,
  isDiscovered,
}: {
  project: (typeof projectData)[0]
  onClick: () => void
  isSelected: boolean
  isDiscovered: boolean
}) {
  const meshRef = useRef<any>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(clock.getElapsedTime() * 0.3 + meshRef.current.position.x) * 0.0005
      if (hovered || isSelected) {
        meshRef.current.scale.lerp({ x: 1.5, y: 1.5, z: 1.5 }, 0.1)
      } else {
        meshRef.current.scale.lerp({ x: 1, y: 1, z: 1 }, 0.1)
      }
    }
  })

  const getSphereColor = () => {
    if (hovered || isSelected) return "#a855f7"
    if (isDiscovered) return "#22c55e"
    return "#8b5cf6"
  }

  return (
    <mesh
      ref={meshRef}
      position={project.position}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
        document.body.style.cursor = "auto"
      }}
    >
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial
        color={getSphereColor()}
        emissive={getSphereColor()}
        emissiveIntensity={hovered || isSelected ? 1.5 : 0.8}
        transparent
        opacity={0.9}
      />

      {(hovered || isSelected) && !project.isEmpty && (
        <Html distanceFactor={10} center>
          <div className="px-3 py-1.5 bg-zinc-900 border border-purple-500/50 rounded-lg text-white text-sm font-medium whitespace-nowrap pointer-events-none">
            {project.name}
          </div>
        </Html>
      )}
    </mesh>
  )
}

function Logo({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.15
    }
  })

  return <group ref={groupRef} position={position}></group>
}

function GridPoints() {
  const pointsRef = useRef<Group>(null)
  const { viewport } = useThree()
  const [points, setPoints] = useState<Array<[number, number, number]>>([])

  useEffect(() => {
    const gridSize = 10
    const spacing = 2
    const newPoints: Array<[number, number, number]> = []

    for (let x = -gridSize; x <= gridSize; x += spacing) {
      for (let z = -gridSize; z <= gridSize; z += spacing) {
        const distance = Math.sqrt(x * x + z * z)
        if (distance > 5) {
          newPoints.push([x, -3, z])
        }
      }
    }

    setPoints(newPoints)
  }, [])

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.02
    }
  })

  return (
    <group ref={pointsRef}>
      {points.map((position, i) => (
        <mesh key={i} position={position}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function FloatingParticles() {
  const particlesRef = useRef<Group>(null)
  const [particles, setParticles] = useState<
    Array<{
      position: [number, number, number]
      speed: number
      size: number
      color: string
    }>
  >([])

  useEffect(() => {
    const count = 50
    const newParticles = []

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 5 + Math.random() * 10
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = (Math.random() - 0.5) * 10

      newParticles.push({
        position: [x, y, z],
        speed: 0.15 + Math.random() * 0.2,
        size: 0.05 + Math.random() * 0.1,
        color: Math.random() > 0.7 ? "#8b5cf6" : "#f0f0f0",
      })
    }

    setParticles(newParticles)
  }, [])

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, i) => {
        const data = particles[i]
        particle.position.y += data.speed * 0.008
        if (particle.position.y > 5) {
          particle.position.y = -5
        }
      })
    }
  })

  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.size, 16, 16]} />
          <meshStandardMaterial
            color={particle.color}
            emissive={particle.color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  )
}

function DataFlowLines() {
  const linesRef = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = clock.getElapsedTime() * 0.03
    }
  })

  return (
    <group ref={linesRef} position={[0, 0, 0]}>
      <Sphere args={[8, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8b5cf6" attach="material" wireframe transparent opacity={0.2} />
      </Sphere>
    </group>
  )
}
