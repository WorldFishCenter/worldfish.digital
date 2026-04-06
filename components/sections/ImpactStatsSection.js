function ImpactStatsSection({ stats }) {
    return (
        <div className="wfImpactBand">
            <div className="container">
                <div className="text-center mb-60">
                    <h3 className="wfImpactTagline">Trusted by organizations shaping the future of global fisheries</h3>
                </div>
                <div className="row justify-content-center">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`col-lg-4 col-md-4 col-sm-12 text-center${index !== 0 ? ' wfImpactCellDivider' : ''}`}
                        >
                            <div className="wfImpactCellInner">
                                <span className="wfImpactValue">
                                    {stat.count}{stat.suffix}
                                </span>
                                <p className="wfStatLabel">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ImpactStatsSection;
