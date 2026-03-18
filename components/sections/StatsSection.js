import CounterUp from "../elements/CounterUp";

function StatsSection({ stats }) {
    return (
        <div className="section-box mt-100">
            <div className="container">
                <div className="row">
                    <div className="col-lg-1" />
                    <div className="col-lg-10">
                        <div className="bd-bottom pb-20 mb-40 text-mb-center">
                            <div className="row">
                                {stats.map((stat, index) => (
                                    <div key={index} className="col-lg-3 col-md-3 col-sm-6 col-6 mb-30">
                                        <span className="text-display-3 color-green-900">
                                            +<CounterUp count={stat.count} time={3} />{stat.suffix}
                                        </span>
                                        <p className="text-body-text color-gray-500 pl-40">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-1" />
                </div>
            </div>
        </div>
    );
}

export default StatsSection;
