import { expressions } from "macromaniajsx/jsx-runtime";
import {
  Bib,
  Bibliography,
  BibScope,
  Cite,
  Dfn,
  Else,
  Gt,
  If,
  Img,
  RefLoc,
  While,
  Wip,
} from "../deps.ts";
import { Assign } from "../deps.ts";
import {
  A,
  B,
  Code,
  Context,
  Counter,
  CssDependency,
  Def,
  Em,
  EscapeHtml,
  Expression,
  Expressions,
  FunctionItem,
  H,
  Hsection,
  JsDependency,
  Li,
  M,
  makeFigureMacro,
  makeNumberingRenderer,
  Marginale,
  MM,
  Ol,
  P,
  PreviewScope,
  Pseudocode,
  R,
  Rb,
  Rc,
  Rcb,
  ResolveAsset,
  Return,
  Rs,
  Rsb,
  Sidenote,
  Sidenotes,
  Span,
  Strong,
  Ul,
  WaitForMarginales,
} from "../deps.ts";
import { ArticleTemplate } from "./articleTemplate.tsx";
import {
  BigO,
  Curly,
  MFunDef,
  NoWrap,
  Np,
  Rank,
  TreeChild,
  TreeChildren,
  TreeItem,
} from "./macros.tsx";
import { TreeItems } from "./macros.tsx";
import { GeoDistribution } from "./macros.tsx";

const ctx = new Context();

/*
Create a custom annotation macro.
*/
function Alj(
  { children, inline }: { children?: Expressions; inline?: boolean },
): Expression {
  return (
    <Wip
      fg="#6804cc"
      bg="#ecdbfc"
      wrap={(_ctx, inner) => <>alj: {inner}</>}
      children={children}
      inline={inline}
    />
  );
}

/*
Create macros for figures (which includes theorem-like blocks).
*/

const figureCounter = new Counter("figure-counter", 0);
const Fig = makeFigureMacro(ctx, {
  figureCounter: figureCounter,
  numberingInfo: {
    r: "Figure",
    rb: "Figure",
    rs: "Figures",
    rsb: "Figures",
    render: makeNumberingRenderer(),
  },
});

// A counter shared by several theorem-like blocks.
const thmCounter = new Counter("thm-counter", 0);

const Theorem = makeFigureMacro(ctx, {
  figureCounter: thmCounter,
  numberingInfo: {
    r: "Theorem",
    rb: "Theorem",
    rs: "Theorems",
    rsb: "Theorems",
    render: makeNumberingRenderer(),
  },
  isTheoremLike: true,
});

const Example = makeFigureMacro(ctx, {
  figureCounter: thmCounter, // Shares the same counter as the `Theorem` macro.
  numberingInfo: {
    r: "Example",
    rb: "Example",
    rs: "Examples",
    rsb: "Examples",
    render: makeNumberingRenderer(),
  },
  isTheoremLike: true,
});

// Exercises are rendered as theorem-like blocks, but do not share the same counter.
const exerciseCounter = new Counter("exercise-counter", 0);

const Exercise = makeFigureMacro(ctx, {
  figureCounter: exerciseCounter, // Different counter than the `Theorem` macro.
  numberingInfo: {
    r: "Exercise",
    rb: "Exercise",
    rs: "Exercises",
    rsb: "Exercises",
    render: makeNumberingRenderer(),
  },
  isTheoremLike: true,
});

// The full input to Macromania is a single expression, which we then evaluate.
const exp = (
  <ArticleTemplate
    title="Geometric Search Trees"
    titleId="title"
    abstract={
      <>
        <P>
          We describe the G-trees, a general family of randomized search tree data structures that encompasses several previously unconnected data structures such as zip-trees, skip-trees, and merkle-search-trees.
          In particular, the family contains trees of arity greater than two.
          Traditionally, such randomized trees have been significantly more complex than their binary counterparts, whereas our <M>k</M>-ary G-trees have no additional conceptual overhead at all.
          We generalize the zip and unzip operations of zip-trees to provide a uniform, simple, and efficient implementation technique for all members of our family of data structures.
        </P>
      </>
    }
    authors={[
      {
        name: "Carson Farmer",
        affiliation: <Wip inline>TODO</Wip>,
        email: <Wip inline>TODO</Wip>,
      },
      {
        name: "Aljoscha Meyer",
        affiliation: "TU Berlin",
        email: "mail@aljoscha-meyer.de",
      },
    ]}
  >
    <Hsection n="introduction" title="Introduction">
      <P>
        Randomized set data structures eschew self-balancing logic for more simple, probabilistic item organization.
        When deriving the necessary randomness via pseudorandom functions of the stored items themselves, the resulting graphs depend on the stored set only, but not the order of insertions and deletions.
        This <Def n="history_independent"
          r="history-independent"
          preview={
            <P>
              A <Def n="history_independent" fake /> set data structure is a data structure whose internal representation dependes only on the set it stores, not on the order of operations through which this set was created or modified.
            </P>
          }
        >
          history-independence
        </Def> ensures that no information about previously deleted items can be reconstructed<Bib item="naor2001anti" />, and it enables <Bib item="pugh1989incremental">efficient set fingerprinting</Bib> when using the data structure as a <Bib item="merkle1989certified">merkle-tree</Bib>.
      </P>

      <P>
        For these reasons, randomized search trees and related data structures have been studied for decades.
        The most prominent such data structures are <Def
          n="treap"
          rs="treaps"
          preview={
            <>
              <P>
                A <Def n="treap" fake>treap</Def> <Bib item="seidel1996randomized" /> is a randomized set data structure that assigns a <Def n="priority" rs="priorities" /> — selected uniformly at random — to each item, and then stores the items in the unique tree that is a search tree with respect to items and a heap with respect to their <Rs n="priority" />.
              </P>
              <P>
                Note that this tree is only unique if there are no duplicate <Rs n="priority" />, hence, the set of priorities to draw from must be fairly large.
              </P>
            </>
          }
        >
          treaps
        </Def><Bib item="seidel1996randomized" />, <Def
          n="skip_list"
          r="skip-list"
          rs="skip-lists"
          preview={
            <P>
              A <Def n="skip_list" fake>skip-list</Def><Bib item="pugh1990skip" /> is a randomized data structure that stores a set of items as a sequence of sorted lists. The first list contains all items, the second list aproximately half of them, the third list again half of those, and so on.
            </P>
          }
        >
          skip-lists
        </Def><Bib item="pugh1990skip" />, and, more recently, <Def
          n="zip_informal"
          r="zip-tree"
          rs="zip-trees"
          preview={
            <P>
              A <Def n="zip_informal" fake>zip-tree</Def><Bib item="tarjan2021zip" /> is a randomized set data structure that assigns a <Def n="rank_informal" r="rank" rs="ranks" /> — selected randomly from a geometric distribution — to each item, and then stores the items in a tree that is a search tree with respect to items and a heap with respect to their <Rs n="rank_informal" />.
              The tree is further constrained in that each left child must have lower <R n="rank_informal" /> than its parent — this makes the tree uniquely defined.
            </P>
          }
        >
          zip-trees
        </Def><Bib item="tarjan2021zip" />.
        All three are different takes on approximating the distribution of items in perfectly balanced binary search trees.
      </P>

      <P>
        While binary trees are highly efficient in theory, they are less efficient on actual hardware than trees that store more than one item
        per vertex.
        Unfortunately, generalizing binary randomized data structures to higher-arity counterparts has proven more difficult than in the case of deterministically self-balancing trees.
        Providing a simple such generalization is the impetus for our work.
      </P>

      <PreviewScope>
        <P>
          We present the <Def n="gtree_informal" r="G-tree" rs="G-trees">geometric search trees</Def> (<Def n="gtree_informal" fake>G-trees</Def>), a general family of randomized search trees that provides a unified perspective on several independently researched data structures, including <Rs n="zip_informal" />, <Def
            n="zipzip"
            r="zip-zip-tree"
            rs="zip-zip-trees"
            preview={
              <>
                <P>
                  The <Def n="zipzip" fake>zip-zip-trees</Def><Bib item="gila2023zip" /> are a modification of the <Rs n="zip_informal" /> that distributes items with colliding <Rs n="rank_informal" /> more efficiently than the <Rs n="zip_informal" />.
                </P>
              </>
            }
          >
            zip-zip-trees
          </Def><Bib item="gila2023zip" />, <Def
            n="skip_tree"
            r="skip-tree"
            rs="skip-trees"
            preview={
              <>
                <P>
                  The <Def n="skip_tree" fake>skip-trees</Def><Bib item="messeguer1997skip" /> are the <Rs n="mst" />, specialized to a radix of two.
                </P>
              </>
            }
          >
            skip-trees
          </Def><Bib item="messeguer1997skip" />, and <Def
            n="mst"
            r="MST"
            rs="MSTs"
            preview={
              <>
                <P>
                  The <Def n="mst" fake>merkle-search-trees</Def><Bib item="auvolat2019merkle" /> are randomized search trees that randomly select the height of each item.
                  The number of items per vertex is random and can grow arbitrarily large.
                </P>
              </>
            }
          >
            merkle-search-trees
          </Def><Bib item="auvolat2019merkle" />.
          Our framework allows us to trivially define efficient trees that store a bounded number of items per vertex.
          These trees are arguably the first such randomized search trees whose conceptual complexity is just as low as that of their binary counterparts.
        </P>
      </PreviewScope>

      <P>
        Our key insight is to take a byproduct of the usual definition of <Rs n="zip_informal" />, turn it into a defining property of its own, and to then generalize it.
        <Rsb n="zip_informal" />{" "} assign geometrically chosen <Rs n="rank_informal" /> to their items, and use these <Rs n="rank_informal" /> for probabilistic balancing.
        A consequence of their balancing mechanism is that certain sequences of items with colliding <Rs n="rank_informal" /> form linked lists.
        It turns out we can view and even <Em>define</Em> <Rs n="zip_informal" /> as collections of such linked lists.
      </P>

      <P>
        From this definition, which is based on arranging <Em>sorted linked lists</Em> in a certain fashion, it is only a small step to arranging <Em>arbitrary set data structures</Em> in the same fashion.
        This yields our <Rs n="gtree_informal" />, a family of trees that is parameterized over a secondary search data structure.
        Using simple linked lists as the underlying data structure yields the <Rs n="zip_informal" />.
        Using an <Bib item="shao1994unrolling">unrolled linked list</Bib> with nodes of size <M>k</M> yields a generalization of the <Rs n="zip_informal" /> where each node can store up to <M>k</M> items.
        And finally, recursively instantiating the <Rs n="gtree_informal" /> with other <Rs n="gtree_informal" /> yields a natural (and efficient) generalization of the <Rs n="zipzip" />.
      </P>

      <P>
        The <Rs n="gtree_informal" /> not only define a unique tree shape for any set of items with associated ranks, they also offer a unified means of implementation.
        We provide generalizations of the zipping and unzipping algorithms of the original <Rs n="zip_informal" />, and use them to implement insertion and deletion.
        These general algorithms can be applied to all <Rs n="gtree_informal" /> whose underlying set data structure supports splitting at arbitrary keys and joining two non-overlapping sets.
        The algorithms perform a number of splits or joins proportional to the number of distinct ranks in the tree, which is logarithmic in the total number of items with high probability.
      </P>

      <P>
        The remainder of the paper is structured as follows: <Wip inline>TODO</Wip>.
      </P>
    </Hsection>

    <Hsection title="Related Work" n="related-work">
      <P>
        Data structures whose exact shape is determined solely by their contents and not by the order of insertion and deletion operations have been studied for decades.
        This property has been given several names such as <Bib item="snyder1977uniquely">unique representation</Bib>, <Bib item="auvolat2019merkle">structural unicity</Bib>, <Bib item="driscoll1994fully">confluent persistence</Bib>, and <Bib item="naor2001anti">anti-persistence or history-independence</Bib>.
        Deterministically self-balancing <R n="history_independent" /> set data structures necessarily take super-logarithmic time to update under arbitrary insertions and deletions<Bib item="snyder1977uniquely" />.
        Hence, several probabilistic <R n="history_independent" /> data structures have been devised which support membership queries and update operations in logarithmic time with high probability.
      </P>

      <P>
        Well-known such (pseuso-) randomized set data structures include <Def
          n="hash_trie"
          r="hash trie"
          preview={
            <P>
              A randomized set data structure that places its items in a <A href="https://en.wikipedia.org/wiki/Trie">trie (prefix tree)</A>, using a hash of each item as its key.
              Described, for example, by Pugh and Teitelbaum<Bib item="pugh1989incremental" />.
            </P>
          }
        >
          hash tries
        </Def> (as presented, for example, by Pugh and Teitelbaum<Bib item="pugh1989incremental" />), <Rs n="treap" /><Bib item="seidel1996randomized" />, and <Rs n="skip_list" /><Bib item="pugh1990skip" />.
        More recently, <Rs n="zip_informal" /> <Bib item="tarjan2021zip" /> and <Rs n="zipzip" /> <Bib item="gila2023zip" /> have been proposed as more efficient variants of <Rs n="skip_list" />.
      </P>

      <P>
        All these data structures approximate the vertex distribution of <Em>binary</Em> balanced search trees.
        While binary search trees are theoretically efficient, CPU caches or block-sized reads from secondary storage make it so that trees that store more than a single item per vertex significantly outperform binary trees in practice.
        Theoretical models to capture this behavior in the analysis of algorithms and data structures include <Bib item="aggarwal1988input">external memory models</Bib> and <Bib item="frigo1999cache">cache-oblivious models</Bib>.
      </P>

      <PreviewScope>
        <P>
          Several attempts have been made to find randomized data structures that perform well in an external memory model.
          Golovin<Bib item="golovin2009b" /> has proposed <Def n="b_treap" r="B-treap" rs="B-treaps">bushy treaps</Def>(<Def n="b_treap" fake>B-treaps</Def>) to approximate the behavior of B-trees via treaps.
          Unfortunately, <Rs n="b_treap" /> are complicated enough that even their author recommends using more simple alternatives such as the <Def n="b_skip_list" r="B-skip-list" rs="B-skip-lists">B-skip-list</Def><Bib item="golovin2010b" />.
          The <R n="b_skip_list" /> still involves a tuning parameter beyond the probability distribution for assigning node levels, a nontrivial invariant, and virtual memory management via hash tables rather than simple usage of pointers.
          In short, the conceptual complexity goes far beyond that of binary <Rs n="skip_list" /> or <Rs n="treap" />.
        </P>
      </PreviewScope>

      <PreviewScope>
        <P>
          Safavi and Seybold<Bib item="safavi2023b" /> propose <Def n="rbst" r="RBST" rs="RBSTs">randomized-block-search-trees</Def> (<Def n="rbst" fake>RBSTs</Def>) as another generalization of binary <Rs n="treap" /> that performs well in an external-memory model.
          The construction involves multiple tuning parameters, two distinct layers of data structure internals, and a highly nontrivial complexity analysis.
        </P>
      </PreviewScope>

      <PreviewScope>
        <P>
          Bender et al<Bib item="bender2016anti" /> first specify a history-independent <Def n="pma" r="PMS" rs="PMAs">packed-memory array</Def> (<Def n="pma" fake>PMA</Def>), and then build a <R n="history_independent" /> B-tree analogon and an external-memory skip-list on top of the <R n="pma" />.
          So there is again a two-layered aproach; the <R n="pma" /> introduces a significant chunk of conceptual complexity that is not part of regular <Rs n="treap" /> or <Rs n="skip_list" />.
        </P>
      </PreviewScope>

      <P>
        Some proponents of randomized data structures claim that a significant advantage over self-balancing data structures is their greater simplicity<Bib item={["pugh1990skip", "seidel1996randomized"]} />.
        It seems safe to say that none of the external-memory constructions we have just listed retain this advantage.
      </P>

      <P>
        A rare exception are the <Rs n="mst">merkle-search-trees</Rs> (<Rs n="mst" />)<Bib item="auvolat2019merkle" />.
        <Rsb n="mst" /> use a simple construction to approximate the distribution of items in a B-tree.
        Unfortunately, <Rs n="mst" /> cannot provide a non-probabilistic upper bound on the number of items per vertex.
        This hampers efficient implementation; and adversarial data suppliers can trivially produce <M>n</M> items in <BigO>n</BigO> expected time that must all be stored in the same vertex.
        The <Rs n="skip_tree" /><Bib item="messeguer1997skip" /> are essentially the radix-two specialization of <Rs n="mst" />.
      </P>
    </Hsection>

    <Hsection title="Preliminaries" n="preliminaries">
      <P>
        Here, we define fundamental terminology, and provide proper definitions and background for <Rs n="zip_informal" />.
      </P>

      <Hsection title="Data Structures" n="prelims_data_structures">
        <PreviewScope>
          <P>
            A <Def n="tree" rs="trees" /> data structure for items from some universe <M><Def n="tree_u" r="U" /></M> is either the <Def n="tree_empty" r="empty tree" rs="empty trees" />, or a <Def n="vertex" rs="vertices" /> consisting of a sequence of <M>k - 1</M> <Def n="item" rs="items">items</Def> from <R n="tree_u" /> and a sequence of <M>k</M> <Rs n="tree" /> called its <Def n="child" rs="children">children</Def>.
          </P>

          <P>
            We write <TreeItems><R n="tree_t" /></TreeItems> for the <Rs n="item" /> of <NoWrap><R n="tree_t" />,</NoWrap> and <TreeItem tree={<R n="tree_t" />}><M>i</M></TreeItem> for the <M>i</M>-th <R n="item" /> of <NoWrap><R n="tree_t" />.</NoWrap>
            We write <TreeChildren><R n="tree_t" /></TreeChildren> for the <Rs n="child" /> of <NoWrap><R n="tree_t" />,</NoWrap> and <TreeChild tree={<R n="tree_t" />}><M>i</M></TreeChild> for the <M>i</M>-th <R n="child" /> of <NoWrap><R n="tree_t" />.</NoWrap>
            Indexing always starts at zero.
          </P>
        </PreviewScope>

        <PreviewScope>
          <P>
            Let <M><Def n="tree_t" r="t" /></M> be a <R n="tree" />.
            The set of <R n="tree_t" />, its <Rs n="child" />, <Em>their</Em> <Rs n="child" />, and so on, is called the set of <Def n="subtree" rs="subtrees">subtrees</Def> of <R n="tree_t" />.
            We say <R n="tree_t" /> is of <Def n="tree_arity" r="arity" rs="arities" /> <M>k</M> if all <Rs n="subtree" /> of <R n="tree_t" /> have at most <M>k</M> <Rs n="child" />.
            We say <R n="tree_t" /> is of <Def n="degree" r="degree" rs="degrees" /> <M>d</M> if it has <M>k</M> <Rs n="child" />.
          </P>
        </PreviewScope>

        <PreviewScope>
          <P>
            Let <M><Def n="item_lte" r="\preceq" /></M> be a <A href="https://en.wikipedia.org/wiki/Total_order">total order</A> on <R n="tree_u" />, and let <M><Def n="tree_d" r="d" /></M> be the <R n="degree" /> of <R n="tree_t" />.
            Then <R n="tree_t" /> is a <Def n="search_tree" r="search tree" rs="search trees" /> <Marginale>
              In a <R n="search_tree" />, intuitively speaking, the <Rs n="item" /> are sorted from left to right. That is, an <A href="https://en.wikipedia.org/wiki/Tree_traversal#In-order,_LNR">in-order traversal</A> yields a sorted sequence.
            </Marginale> (with respect to <R n="tree_u" />) if it is the <R n="tree_empty" />, or if<Ul>
              <Li>
                <TreeItems><R n="tree_t" /></TreeItems> is sorted with respect to <R n="tree_u" />,
              </Li>
              <Li>
                all <Rs n="item" /> in <TreeChild tree={<R n="tree_t" />}><M>0</M></TreeChild> are less than <TreeItem tree={<R n="tree_t" />}><M>0</M></TreeItem>,
              </Li>
              <Li>
                for all <M post=",">0 \lt <Def n="searchtree_i" r="i" /> \lt <R n="tree_d" /> - 1</M> all <Rs n="item" /> in <TreeChild tree={<R n="tree_t" />}><M><R n="searchtree_i" /></M></TreeChild> are less than <TreeItem tree={<R n="tree_t" />}><M><R n="searchtree_i" /> - 1</M></TreeItem> and greater than <NoWrap><TreeItem tree={<R n="tree_t" />}><M><R n="searchtree_i" /> - 1</M></TreeItem>,</NoWrap> and
              </Li>
              <Li>
                all <Rs n="item" /> in <TreeChild tree={<R n="tree_t" />}><M><R n="tree_d" /> - 1</M></TreeChild> are greater than <TreeItem tree={<R n="tree_t" />}><M><R n="tree_d" /> - 2</M></TreeItem>.
              </Li>
            </Ul>
          </P>
        </PreviewScope>

        <PreviewScope>
          <P>
            We call <R n="tree_t" /> a <Def n="heap" rs="heaps" /><Marginale>
              In a <R n="heap" />, intuitively speaking, no <R n="item" /> is a descendant of a lesser item.
            </Marginale> if it is the <R n="tree_empty" />, or if<Ul>
              <Li>
                the greatest <R n="item" /> in all strict <Rs n="subtree" /> of <R n="tree_t" /> is less than or equal to the least <R n="item" /> amongst <TreeItems><R n="tree_t" /></TreeItems>, and
              </Li>
              <Li>
                all <Rs n="child" /> of <R n="tree_t" /> are themselves <Rs n="heap" />.
              </Li>
            </Ul>
          </P>
        </PreviewScope>

        <P>
          <Alj inline>
            You put balancing (deterministic and probabilistic) into your preliminaries.
            Should we also put them into the final paper?
            I think we don't necessarily need them, since the definitions are not formal anyways.
          </Alj>
        </P>
      </Hsection>

      <Hsection
        title="Pseudorandom Geometric Distributions"
        n="prelim_geometric_distribution"
      >
        <PreviewScope>
          <P>
            Let <M><Def n="geo_p" r="p" /></M> be a probability.
            A <Def
              n="geometric_distribution"
              r="geometric distribution"
              rs="geometric distributions"
              math="\mathcal{G}"
            /> <GeoDistribution><R n="geo_p" /></GeoDistribution> is a disrete probability distribution where the random variable <M><Def n="rand_x" r="X" /></M> takes on value <M><Def n="rand_k" r="k" /> \in <Np /></M> with probability <M>P(<R n="rand_x" /> = <R n="rand_k" />) = (1 -<R n="geo_p" />)^{`{`}<R n="rand_k" /> - 1{`}`}</M><Alj>Is this correct?</Alj>.
            We can interpret <R n="rand_k" /> as the outcome of a series of Bernoulli trials with success probability <R n="geo_p" />, where the rank <R n="rand_k" /> represents the number of failures before the first success, plus one.
          </P>
        </PreviewScope>

        <PreviewScope>
          <P>
            We often wish to pseudorandomly map items from some universe <M><Def n="geo_u" r="U" /></M> to geometrically distributed <Def n="rank" rs="ranks">ranks</Def>.
            To this end, we require a rank function <MFunDef
              n="fn_rank"
              dom={<R n="geo_u" />}
              co="\N"
              sub={<R n="geo_p" />}
            >rank</MFunDef>, such that <Rank p={<R n="geo_p" />}><R n="geo_arg_u" /></Rank> for any <M><Def n="geo_arg_u" r="u" /> \in <R n="geo_u" /></M> is drawn independently from a geometric distribution <GeoDistribution><R n="geo_p" /></GeoDistribution>.
            We simply write <Rank><R n="geo_arg_u" /></Rank> when <R n="geo_p" /> is unimportant or clear from context.
          </P>
        </PreviewScope>

        <P>
          In practice, <Rank p={<R n="geo_p" />}><R n="geo_arg_u" /></Rank> can be implemented by hashing <R n="geo_arg_u" /> with a secure hash function and counting the number of trailing zeros in the binary representation of the digest.
          This can also be interpreted as the largest power of two that divides the digest of <R n="geo_arg_u" />, as used by Pugh<Bib item="pugh1989incremental" />.
          Auvolat and Taïani<Bib item="auvolat2019merkle" /> generalize this construction to distributions <GeoDistribution>\frac<Curly>1</Curly><Curly>k</Curly></GeoDistribution> by counting trailing or leading zeroes in the base-<M>k</M> representation of uniformly distributed pseudorandom integers.
        </P>
      </Hsection>
    </Hsection>
  </ArticleTemplate>
);

// Evaluate the expression. This has exciting side-effects,
// like creating a directory that contains a website!
ctx.evaluate(exp);
