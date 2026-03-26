"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../lib/motion";
import { Button } from "./ui/button";
import { featuredPrIds } from "../data/featured-prs";

const POW = () => {
    const [PRs, setPRs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedOrg, setExpandedOrg] = useState<string | null>(null);

    enum Orgs {
        Webpack = "webpack",
        DIGI_UW = "digi-uw",
        NodeJS = "nodejs",
    }

    useEffect(() => {
        const fetchPRs = async () => {
            setLoading(true);
            try {
                let data = [];
                if (featuredPrIds && featuredPrIds.length > 0) {
                    const prPromises = featuredPrIds.map(id => 
                        axios.get(`https://api.github.com/repositories/${id.toString().split('_')[0]}/pulls/${id.toString().split('_')[1]}`).catch(() => null)
                    );
                    const res = await axios.get("https://api.github.com/search/issues?q=author%3Akatari-8055+type%3Apr&per_page=100");
                    data = res.data.items.filter((pr: any) => featuredPrIds.includes(pr.id));
                } else {
                    const res = await axios.get("https://api.github.com/search/issues?q=author%3Akatari-8055+type%3Apr&per_page=100");
                    data = res.data.items;
                }
                
                setPRs(data);
            } catch (error) {
                console.error(error);
                setError("Failed to fetch PRs");
            } finally {
                setLoading(false);
            }
        }

        fetchPRs();
    }, [])

    const prsForOrg = (ownerName: string) => {
        if (!PRs || PRs.length === 0) return [] as any[];
        const filtered = PRs.filter((p: any) => {
            try {
                const parts = p.repository_url.split('/');
                const owner = parts[parts.length - 2];
                return String(owner).toLowerCase() === ownerName.toLowerCase();
            } catch (e) {
                return false;
            }
        });
        return filtered;
    }

    const ORG_LABELS: Record<string, string> = {
        [Orgs.Webpack]: 'Webpack',
        [Orgs.DIGI_UW]: 'DIGI-UW',
        [Orgs.NodeJS]: 'Node.js',
    }

    const ORG_LOGOS: Record<string, string> = {
        [Orgs.Webpack]: 'https://avatars.githubusercontent.com/u/2105791?s=200&v=4',
        [Orgs.DIGI_UW]: 'https://avatars.githubusercontent.com/u/23546700?s=200&v=4',
        [Orgs.NodeJS]: 'https://avatars.githubusercontent.com/u/9950313?s=200&v=4',
    }

    return (
        <motion.div id="pow" className="flex flex-col w-full items-center" initial="hidden" whileInView="visible">
            <motion.div className="text-3xl font-bold mb-6" variants={itemVariants}>Open Source Contributions</motion.div>

            {error && <div className="text-sm text-red-500 my-12 text-center">{error}</div>}

            {loading ? (
                <div className="flex flex-col items-center gap-2 my-12 text-sm text-muted-foreground font-mono">
                    <div className="animate-pulse">Loading Contributions...</div>
                </div>
            ) : (
                <motion.div className="flex flex-col gap-6 sm:w-2/3 items-center justify-center my-6 w-full px-4" variants={containerVariants} initial="hidden" whileInView="visible">
                    {Object.values(Orgs).map((org) => {
                        const orgPRs = prsForOrg(org);
                        const isExpanded = expandedOrg === org;
                        return (
                            <motion.div key={org} className="w-full rounded-md py-4 px-6 bg-card border border-border" variants={itemVariants}>
                                <div className="flex items-center gap-4">
                                    <img src={`${ORG_LOGOS[org]}`} alt={`${ORG_LABELS[org]} logo`} className="w-16 h-16 rounded-md object-contain p-1 bg-white" />
                                    <div className="flex-1">
                                        <div className="text-lg font-semibold">{ORG_LABELS[org]}</div>
                                        <div className="text-sm text-muted-foreground">{orgPRs.length} PR{orgPRs.length !== 1 ? 's' : ''} <span className="font-semibold">({orgPRs.filter((p: any) => p.state === 'closed' && p.pull_request?.merged_at).length} merged)</span></div>
                                    </div>
                                    <div>
                                        <Button
                                            onClick={() => setExpandedOrg(isExpanded ? null : org)}
                                            className="px-4 py-2 rounded-md bg-zinc-700 hover:bg-zinc-600 transition-all text-white text-xs font-semibold"
                                        >
                                            {isExpanded ? 'Hide' : 'View PRs'}
                                        </Button>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <motion.div className="mt-6 flex flex-col gap-3 overflow-hidden border-t border-border pt-4" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                        {orgPRs.length > 0 ? orgPRs.map((pr: any) => (
                                            <a
                                                key={pr.id}
                                                href={pr.html_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-border hover:border-primary/50 transition-colors"
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="text-sm font-medium line-clamp-1">{pr.title}</h4>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                                        pr.pull_request?.merged_at ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                                        pr.state === 'open' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                        {pr.pull_request?.merged_at ? 'Merged' : pr.state}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-muted-foreground flex gap-3">
                                                    <span>#{pr.number}</span>
                                                    <span>{new Date(pr.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </a>
                                        )) : (
                                            <div className="text-sm text-muted-foreground py-2 italic text-center">No PRs found for this organization.</div>
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </motion.div>
    );
};

export default POW;