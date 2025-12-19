"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../lib/motion";
import { Button } from "./ui/button";

enum Orgs {
    Calcom = "calcom",
    Open_Healthcare_Network = "ohcnetwork",
    Cosscom = "cosscom",
}

const POW = () => {
    const [PRs, setPRs] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedOrg, setExpandedOrg] = useState<string | null>(null);

    useEffect(() => {
        const fetchPRs = async () => {
            setLoading(true);
            try {
                const res = await axios.get("https://api.github.com/search/issues?q=author%3ASpandan-Mishra+type%3Apr&per_page=100");
                const data = res.data.items.filter((p: any) => {
                    if (Object.values(Orgs).includes(p.url.split('/')[4].toLowerCase())) return true;
                    return false;
                })
                console.log(data);
                setPRs(data);
            } catch (error) {
                console.log(error);
                setError("Failed to fetch PRs");
            } finally {
                setLoading(false);
            }
        }

        fetchPRs();
    }, [])

    const prsForOrg = (ownerName: string) => {
        if (!PRs) return [] as any[];
        return PRs.filter((p: any) => {
            try {
                const parts = new URL(p.repository_url).pathname.replace(/\/$/, '').split('/');
                const owner = parts.at(-2) || '';
                return String(owner).toLowerCase() === ownerName.toLowerCase();
            } catch (e) {
                return false;
            }
        });
    }

    const ORG_LABELS: Record<string, string> = {
        [Orgs.Calcom]: 'Cal.com',
        [Orgs.Open_Healthcare_Network]: 'Open Healthcare Network',
        [Orgs.Cosscom]: 'Coss.com',
    }

    const ORG_LOGOS: Record<string, string> = {
        [Orgs.Calcom]: '/cal-com-logo.svg',
        [Orgs.Open_Healthcare_Network]: '/ohc-logo.svg',
        [Orgs.Cosscom]: '/coss-logo.svg',
    }

    return (
        <motion.div id="pow" className="flex flex-col w-full items-center" initial="hidden" whileInView="visible">
            <motion.div className="text-3xl font-bold mb-6" variants={itemVariants}>Proof of Work</motion.div>

            {error && <div className="text-sm text-red-500 my-12">{error}</div>}

            {loading ? (
                <div className="text-sm text-muted-foreground my-12">Loading...</div>
            ): (
                <motion.div className="flex flex-col gap-6 w-2/3 items-center justify-center my-6" variants={containerVariants} initial="hidden" whileInView="visible">
                    {Object.values(Orgs).map((org) => {
                        const orgPRs = prsForOrg(org);
                        const isExpanded = expandedOrg === org;
                        return (
                            <motion.div key={org} className=" w-full rounded-md py-2 px-6 bg-card" variants={itemVariants}>
                                <div className="flex items-center gap-4">
                                    <img src={`${ORG_LOGOS[org]}`} alt={`${ORG_LABELS[org]} logo`} className="w-16 h-16 rounded-md" />
                                    <div className="flex-1">
                                        <div className="text-lg font-semibold">{ORG_LABELS[org]}</div>
                                        <div className="text-sm text-muted-foreground">{orgPRs.length} PR{orgPRs.length !== 1 ? 's' : ''} <span className="font-semibold">({orgPRs.filter((p: any) => p.state === 'closed' && p.pull_request?.merged_at).length} merged)</span></div>
                                    </div>
                                    <div>
                                        <Button
                                            onClick={() => setExpandedOrg(isExpanded ? null : org)}
                                            className="px-3 py-1 rounded-md bg-zinc-700 hover:bg-zinc-600 hover:shadow-lg transition-all text-white"
                                        >
                                            {isExpanded ? 'Hide' : 'View PRs'}
                                        </Button>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <motion.div className="mt-4" variants={itemVariants} initial="hidden" animate="visible">
                                        {orgPRs.length === 0 && <div className="text-sm text-muted-foreground">No PRs for this org.</div>}
                                        <div className="grid grid-cols-2 gap-3">
                                            {orgPRs.map((p: any) => (
                                                <a key={p.id} href={p.html_url} target="_blank" rel="noreferrer" className="block p-3 border rounded-xl hover:shadow-lg border-zinc-300 transition-shadow">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <div className="text-sm text-muted-foreground">{new URL(p.repository_url).pathname.split('/').slice(-2).join('/')}</div>
                                                            <div className="font-medium">{p.title} <span className="text-xs text-muted-foreground">(#{p.number})</span></div>
                                                        </div>
                                                        <div className="text-right text-xs text-muted-foreground">
                                                            <div>{new Date(p.created_at).toLocaleDateString()}</div>
                                                            <div className="mt-1">
                                                                {p.state === 'open' ? (
                                                                    <span className="text-green-500">Open</span>
                                                                ) : p.pull_request.merged_at ? (
                                                                    <span className="text-purple-500">Merged</span>
                                                                ) : (
                                                                    <span className="text-red-600">Closed</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )
                    })}
                </motion.div>
            )}
            
        </motion.div>
    );
}

export default POW;