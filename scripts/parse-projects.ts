const tsvData = `NAME	LOGO	PJ TYPE	TAGS	X	WEB	BANNER	INFO	ONLY on Monad	🟥 = sus / website link broken / dead pjs
0x	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b9106b6ca74a7001624998_0x_logo.webp	Infra	Dev,Tooling	https://x.com/0xProject	https://0x.org/	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67b910681d1e917a4b1a10d9_0x_banner.webp	0x allows you to embed swaps in any onchain app. Tap into aggregated liquidity from 130+ sources, best prices &amp; optimal trade execution.	No	
AUSD	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67c620f4a0bab10af98e0508_ausd.webp	App/Infra	DeFi	https://x.com/withAUSD	https://agora.finance	https://cdn.prod.website-files.com/669ade140a683001b9f7fd78/67c620f148f4cde61d6cf7fb_ausd%20(1).webp	Agora is a stablecoin issuer of AUSD, backed 1:1 by cash and cash equivalent reserves managed by VanEck and custodied by State Street.	No	`

// Parse TSV and generate project data
const lines = tsvData.trim().split("\n").slice(1) // Skip header
const projects = lines
  .map((line) => {
    const [name, logo, category, tags, twitter, website, banner, description] = line.split("\t")
    return {
      name: name?.trim() || "",
      logo: logo?.trim() || "",
      category: category?.trim() || "",
      tags: tags?.split(",").map((t: string) => t.trim()) || [],
      twitter: twitter?.trim() || "",
      website: website?.trim() || "",
      banner: banner?.trim() || "",
      description: description?.trim() || "",
    }
  })
  .filter((p) => p.name) // Remove empty entries

console.log(`Total projects: ${projects.length}`)
console.log(JSON.stringify(projects.slice(0, 5), null, 2)) // Show first 5 as sample
