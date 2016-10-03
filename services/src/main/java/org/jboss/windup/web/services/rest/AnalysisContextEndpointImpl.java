package org.jboss.windup.web.services.rest;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.Valid;

import org.jboss.windup.web.services.model.AnalysisContext;
import org.jboss.windup.web.services.model.RulesPath;
import org.jboss.windup.web.services.service.AnalysisContextService;
import org.jboss.windup.web.services.service.ConfigurationService;

/**
 * @author <a href="mailto:jesse.sightler@gmail.com">Jesse Sightler</a>
 */
@Stateless
public class AnalysisContextEndpointImpl implements AnalysisContextEndpoint
{
    @PersistenceContext
    private EntityManager entityManager;

    @Inject
    private AnalysisContextService analysisContextService;

    @Override
    public AnalysisContext get(Long id)
    {
        return entityManager.find(AnalysisContext.class, id);
    }

    @Override
    public AnalysisContext create(@Valid AnalysisContext analysisContext)
    {
        return analysisContextService.create(analysisContext);
    }

    @Override
    public AnalysisContext update(@Valid AnalysisContext analysisContext)
    {
        return analysisContextService.update(analysisContext);
    }
}
