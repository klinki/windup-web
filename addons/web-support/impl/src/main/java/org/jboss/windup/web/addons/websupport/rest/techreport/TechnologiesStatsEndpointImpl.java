package org.jboss.windup.web.addons.websupport.rest.techreport;

import javax.inject.Singleton;

import org.jboss.windup.graph.GraphContext;
import org.jboss.windup.rules.apps.javaee.model.stats.ProjectTechnologiesStatsService;
import org.jboss.windup.web.addons.websupport.rest.graph.AbstractGraphResource;

/**
 * Contains methods for managing technologies statistics.
 *
 * @author <a href="mailto:zizka@seznam.cz">Ondrej Zizka</a>
 */
@Singleton
public class TechnologiesStatsEndpointImpl extends AbstractGraphResource implements TechnologiesStatsEndpoint
{
    @Override
    public boolean computeTechStats(long executionId)
    {
        final GraphContext graphContext = this.getGraph(executionId);

        ProjectTechnologiesStatsService technologiesStatsService = new ProjectTechnologiesStatsService(graphContext);
        technologiesStatsService.computeStats();

        return true;
    }
}
