package org.jboss.windup.web.services.rest;

import java.net.URL;
import java.util.Collection;

import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.resteasy.client.jaxrs.ResteasyClient;
import org.jboss.resteasy.client.jaxrs.ResteasyWebTarget;
import org.jboss.windup.web.services.AbstractTest;
import org.jboss.windup.web.services.ServiceTestUtil;
import org.jboss.windup.web.services.data.DataProvider;
import org.jboss.windup.web.services.data.ServiceConstants;
import org.jboss.windup.web.services.model.ApplicationGroup;
import org.jboss.windup.web.services.model.Category;
import org.jboss.windup.web.services.model.MigrationProject;
import org.jboss.windup.web.services.model.ReportFilter;
import org.jboss.windup.web.services.model.Tag;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * @author <a href="mailto:dklingenberg@gmail.com">David Klingenberg</a>
 */
@RunWith(Arquillian.class)
public class ReportFilterEndpointTest extends AbstractTest
{
    @ArquillianResource
    private URL contextPath;

    private ReportFilterEndpoint reportFilterEndpoint;
    private DataProvider dataProvider;
    private ResteasyClient client;
    private ResteasyWebTarget target;

    @Before
    public void setUp()
    {
        this.client = ServiceTestUtil.getResteasyClient();
        this.target = client.target(contextPath + ServiceConstants.REST_BASE);
        this.dataProvider = new DataProvider(target);

        this.reportFilterEndpoint = target.proxy(ReportFilterEndpoint.class);
    }

    @Test
    @RunAsClient
    public void testGetDefaultFilter() throws Exception
    {
        MigrationProject dummyProject = this.dataProvider.getMigrationProject();
        ApplicationGroup group = this.dataProvider.getApplicationGroup(dummyProject);

        ReportFilter filter = this.reportFilterEndpoint.getFilter(group.getId());
        this.assertFilterEmpty(filter);
    }

    @Test
    @RunAsClient
    public void testUpdateFilter() throws Exception
    {
        MigrationProject dummyProject = this.dataProvider.getMigrationProject();
        ApplicationGroup group = this.dataProvider.getApplicationGroup(dummyProject);

        ReportFilter originalFilter = this.reportFilterEndpoint.getFilter(group.getId());
    }

    protected void assertFilterEmpty(ReportFilter filter)
    {
        Assert.assertNotNull(filter);
        Assert.assertNotNull(filter.getId());

        Assert.assertNotNull(filter.getExcludeCategories());
        Assert.assertNotNull(filter.getExcludeTags());

        Assert.assertNotNull(filter.getIncludeCategories());
        Assert.assertNotNull(filter.getIncludeTags());

        Assert.assertFalse(filter.isEnabled());
    }

    @Test
    @RunAsClient
    public void testClearFilter()
    {
        MigrationProject dummyProject = this.dataProvider.getMigrationProject();
        ApplicationGroup group = this.dataProvider.getApplicationGroup(dummyProject);

        ReportFilter originalFilter = this.reportFilterEndpoint.getFilter(group.getId());
        ReportFilter clearedFilter = this.reportFilterEndpoint.clearFilter(group.getId());

        this.assertFilterEmpty(clearedFilter);
    }


    @Test
    @RunAsClient
    public void testGetTags()
    {
        Collection<Tag> tags = this.reportFilterEndpoint.getTags();
        Assert.assertFalse(tags.isEmpty());
    }

    @Test
    @RunAsClient
    public void testGetCategories()
    {
        Collection<Category> categories = this.reportFilterEndpoint.getCategories();
        Assert.assertFalse(categories.isEmpty());
    }
}
