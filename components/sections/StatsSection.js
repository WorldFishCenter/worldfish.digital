import CounterUp from '../elements/CounterUp';

function StatsSection({ stats }) {
    return (
        <div className="wfStatsBand">
            <div className="container">
                <div className="row justify-content-center">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`col-lg-3 col-md-3 col-sm-6 col-6 text-center mb-30${index !== 0 ? ' wfStatCellDivider' : ''}`}
                        >
                            <span className="wfStatValue">
                                +<CounterUp count={stat.count} time={3} />{stat.suffix}
                            </span>
                            <p className="wfStatLabel">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default StatsSection;
