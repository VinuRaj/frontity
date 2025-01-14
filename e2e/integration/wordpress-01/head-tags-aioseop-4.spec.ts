import { ResolvePackages } from "../../../packages/types/src/utils";
import Router from "../../../packages/router/types";
import type { taskTypes } from "../../plugins";
const task: taskTypes = cy.task;

type WindowWithFrontity = Cypress.AUTWindow & {
  frontity: ResolvePackages<Router>;
};

describe("Head Tags - All in One SEO Pack ^4.0.16", () => {
  before(() => {
    task("installPlugin", { name: "all-in-one-seo-pack" });
    task("installPlugin", { name: "rest-api-head-tags" });
    task("installPlugin", { name: "custom-post-type-ui" });
    task("loadDatabase", {
      path: "./wp-data/head-tags/aioseop-4.sql",
    });
  });

  after(() => {
    task("resetDatabase");
    task("removeAllPlugins");
  });

  /**
   * Generates the full url to be loaded and tested.
   *
   * @param link - The pathname to wich the test should navigate.
   * @returns The full url.
   */
  const fullURL = (link: string) =>
    `http://localhost:3001${link}?frontity_name=head-tags`;

  /**
   * Check the title for the current page is the given one.
   *
   * @param link - The given link.
   * @param title - The page title for the given link.
   */
  const checkTitle = (link: string, title: string) => {
    it("should render the correct title", () => {
      cy.visitSSR(fullURL(link)).then(() => {
        cy.get("title").should("contain", title);
      });
    });
  };

  /**
   * Ensure that the canonical link has been rendered.
   *
   * @param link - The given link.
   */
  const checkCanonical = (link: string) => {
    it("should render the correct canonical link", () => {
      cy.visitSSR(fullURL(link)).then(() => {
        cy.get('link[rel="canonical"]').toMatchSnapshot();
      });
    });
  };

  /**
   * Ensure that the ld+json schema has been rendered.
   *
   * @param link - The given link.
   */
  const checkSchema = (link: string) => {
    it("should render the schema tag", () => {
      cy.visitSSR(fullURL(link)).then(() => {
        cy.get('script[type="application/ld+json"]').toMatchSnapshot();
      });
    });
  };

  /**
   * Ensure that the Open Graph meta tags have been rendered.
   *
   * @param link - The given link.
   */
  const checkOpenGraphTags = (link: string) => {
    it("should render the Open Graph tags", () => {
      cy.visitSSR(fullURL(link)).then(() => {
        cy.get(
          `
        meta[property^="og:"],
        meta[property^="article:"],
        meta[property^="profile:"]
        `
        ).each((meta) => {
          cy.wrap(meta).toMatchSnapshot();
        });
      });
    });
  };

  /**
   * Ensure that the Twitter meta tags have been rendered.
   *
   * @param link - The given link.
   */
  const checkTwitterTags = (link: string) => {
    it("should render the Twitter tags", () => {
      cy.visitSSR(fullURL(link)).then(() => {
        cy.get('meta[property^="twitter:"]').each((meta) => {
          cy.wrap(meta).toMatchSnapshot();
        });
      });
    });
  };

  /**
   * Change the router value in Frontity.
   *
   * @param link - The link of the page.
   */
  const routerSet = (link: string) => {
    cy.window().then((win: WindowWithFrontity) => {
      win.frontity.actions.router.set(link);
    });
  };

  /**
   * Tests for posts.
   */
  describe("Post", () => {
    const link = "/hello-world/";
    const title = "Hello world! | Test WP Site";

    checkTitle(link, title);
    checkCanonical(link);
    checkOpenGraphTags(link);
    checkTwitterTags(link);
    checkSchema(link);
  });

  /**
   * Tests for pages.
   */
  describe("Page", () => {
    const link = "/sample-page/";
    const title = "Sample Page | Test WP Site";

    checkTitle(link, title);
    checkCanonical(link);
    checkOpenGraphTags(link);
    checkTwitterTags(link);
    checkSchema(link);
  });

  /**
   * Tests for categories.
   */
  describe("Category", () => {
    const link = "/category/nature/";
    const title = "Nature | Test WP Site";

    checkTitle(link, title);
    checkCanonical(link);
    checkSchema(link);
  });

  /**
   * Tests for tags.
   */
  describe("Tag", () => {
    const link = "/tag/japan/";
    const title = "Japan | Test WP Site";

    checkTitle(link, title);
    checkCanonical(link);
    checkSchema(link);
  });

  /**
   * Tests for authors.
   */
  describe("Author", () => {
    const link = "/author/luisherranz";
    const title = "luisherranz | Test WP Site";

    checkTitle(link, title);
    checkCanonical(link);
    checkSchema(link);
  });

  /**
   * Tests for the homepage.
   */
  describe("Homepage", () => {
    const link = "/";
    const title = "Test WP Site | Just another WordPress site";

    checkTitle(link, title);
    checkCanonical(link);
    checkOpenGraphTags(link);
    checkTwitterTags(link);
    checkSchema(link);
  });

  /**
   * Tests for custom post types.
   */
  describe("CPT", () => {
    const link = "/movie/the-terminator/";
    const title = "The Terminator | Test WP Site";

    checkTitle(link, title);
    checkCanonical(link);
    checkOpenGraphTags(link);
    checkTwitterTags(link);
    checkSchema(link);
  });

  /**
   * Tests for archive of custom post types.
   */
  describe("CPT (archive)", () => {
    const title = "Movies | Test WP Site";
    const link = "/movies/";

    checkTitle(link, title);
    checkCanonical(link);
    checkSchema(link);
  });

  /**
   * Tests for custom taxonomies.
   */
  describe("Custom Taxonomy", () => {
    const link = "/actor/linda-hamilton/";
    const title = "Linda Hamilton | Test WP Site";

    checkTitle(link, title);
    checkCanonical(link);
    checkSchema(link);
  });

  /**
   * Test for the `<title>` tag while navigating through Frontity.
   */
  describe("Title tag", () => {
    it("should be correct while navigating", () => {
      cy.visit(fullURL("/"));

      cy.get("title").should(
        "contain",
        "Test WP Site | Just another WordPress site"
      );

      routerSet("/hello-world/");
      cy.get("title").should("contain", "Hello world! | Test WP Site");

      routerSet("/sample-page/");
      cy.get("title").should("contain", "Sample Page | Test WP Site");

      routerSet("/category/nature/");
      cy.get("title").should("contain", "Nature | Test WP Site");

      routerSet("/tag/japan/");
      cy.get("title").should("contain", "Japan | Test WP Site");

      routerSet("/author/luisherranz");
      cy.get("title").should("contain", "luisherranz | Test WP Site");

      routerSet("/movie/the-terminator/");
      cy.get("title").should("contain", "The Terminator | Test WP Site");

      routerSet("/movies/");
      cy.get("title").should("contain", "Movies | Test WP Site");

      routerSet("/actor/linda-hamilton/");
      cy.get("title").should("contain", "Linda Hamilton | Test WP Site");
    });
  });
});
